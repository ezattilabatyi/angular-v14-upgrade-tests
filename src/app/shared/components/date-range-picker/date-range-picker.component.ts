import { Component, forwardRef, Input, Optional } from '@angular/core';
import { DateAdapter, ThemePalette } from '@angular/material/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { DateRange } from 'moment-range';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDatepicker } from '@angular/material/datepicker';

import { noop } from 'rxjs';
import { invalid, Moment } from 'moment';
import { momentWithRange } from '@app/shared/utils/moment-with-range';

import * as moment from 'moment';

type DatePickerMode = 'day' | 'month' | 'year';
type StartView = 'month' | 'year' | 'multi-year'; // from angular MatDatepicker

@Component({
  selector: 'etrm-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent implements ControlValueAccessor, Validator {

  @Input()
  public get mode(): DatePickerMode {
    return this._mode;
  }

  public set mode(mode: DatePickerMode) {
    this._mode = mode;
    this.startView = this.getStartView();
  }

  private _mode: DatePickerMode = 'day';


  /** The value of the input. */
  // @ts-ignore
  set value(value: DateRange | [Date | Moment, Date | Moment]) {
    const inputValue: DateRange | null = (value instanceof DateRange) ? value : DateRangePickerComponent.deserialize(value);
    if (inputValue) {
      this.dateRangeForm.patchValue({
        validFrom: inputValue.start,
        validTo: inputValue.end
      });

      this.dateRangeForm.reset(this.dateRangeForm.value, { onlySelf: true, emitEvent: false });
    }
    this._value = inputValue;
  }

  @Input()
  // @ts-ignore
  get value(): DateRange {
    return this._value as DateRange;
  }

  @Input()
  public serverErrors!: HttpErrorResponse;

  /** Whether the datepicker-input is disabled. */
  set disabled(isDisabled: boolean) {
    this._disabled = isDisabled;
    isDisabled ? this.dateRangeForm.disable() : this.dateRangeForm.enable();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set startDisabled(isDisabled: boolean) {
    this._startDisabled = isDisabled;
  }

  @Input()
  get startDisabled(): boolean {
    return this._startDisabled;
  }

  set endDisabled(isDisabled: boolean) {
    this._endDisabled = isDisabled;
  }

  @Input()
  get endDisabled(): boolean {
    return this._endDisabled;
  }


  /** The minimum valid date. */
  set min(value: Moment | Date | null) {
    // @ts-ignore
    this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._onValidatorChanged();
  }

  @Input()
  get min(): Moment | Date | null {
    return this._min;
  }

  @Input()
  get minStartDate(): Moment | Date | null {
    return !this.startDisabled ? this._min : null;
  }

  @Input()
  get minEndDate(): Moment | Date | null {
    return !this.endDisabled ? this._min : null;
  }

  /** The maximum valid date. */
  set max(value: Moment | Date | null) {
    // @ts-ignore
    this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
    this._onValidatorChanged();
  }

  @Input()
  get max(): Moment | Date | null {
    return this._max;
  }

  @Input()
  get maxStartDate(): Moment | Date | null {
    return !this.startDisabled ? this._max : null;
  }

  @Input()
  get maxEndDate(): Moment | Date | null {
    return !this.endDisabled ? this._max : null;
  }

  set startAt(value: Moment | null) {
    // @ts-ignore
    this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The date to open the start date's calendar to initially. */
  @Input()
  get startAt(): Moment | null {
    return this._startAt;
  }

  set endAt(value: Moment | null) {
    // @ts-ignore
    this._endAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
  }

  /** The date to open the end date's calendar to initially. */
  @Input()
  get endAt(): Moment | null {
    return this._endAt;
  }

  set label(value: string) {
    this._label = value;
  }

  @Input()
  get label(): string {
    return this._label;
  }

  set startLabel(value: string) {
    this._startLabel = value;
  }

  @Input()
  get startLabel(): string {
    return this._startLabel;
  }

  set endLabel(value: string) {
    this._endLabel = value;
  }

  @Input()
  get endLabel(): string {
    return this._endLabel;
  }

  set color(value: ThemePalette) {
    this._color = value;
  }

  /** Color palette to use on the daterangepicker's calendar. */
  @Input()
  get color(): ThemePalette {
    return this._color;
  }

  set touchUi(value: boolean) {
    this._touchUi = value;
  }

  /**
   * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
   * than a popup and elements have more padding to allow for bigger touch targets.
   */
  @Input()
  get touchUi(): boolean {
    return this._touchUi;
  }

  get startDate(): Moment {
    return this.dateRangeForm.controls['validFrom'].value;
  }

  get endDate(): Moment {
    return this.dateRangeForm.controls['validTo'].value;
  }

  private _value!: DateRange | null;
  private _disabled: boolean = false;
  private _startDisabled: boolean = false;
  private _endDisabled: boolean = false;
  private _min!: Moment | null;
  private _max!: Moment | null;
  private _startAt!: Moment | null;
  private _endAt!: Moment | null;
  private _label!: string;
  private _startLabel!: string;
  private _endLabel!: string;
  private _color!: ThemePalette;
  private _touchUi: boolean = false;

  public validFormControl: UntypedFormControl = new UntypedFormControl(null);
  public validToControl: UntypedFormControl = new UntypedFormControl(null);

  public dateRangeForm: UntypedFormGroup = new UntypedFormGroup({
    validFrom: this.validFormControl,
    validTo: this.validToControl
  });

  public startView: StartView = 'month';

  private _onValidatorChanged: () => void = noop;
  private _onChanged: (_: DateRange) => void = noop;
  private _onTouched: () => void = noop;

  private static deserialize(value: [Date | Moment, Date | Moment]): DateRange | null {
    return (value === null) ? null : momentWithRange.range(value);
  }

  private _validateStartDate: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
    const validation: boolean = !c.value || !c.value.start || c.value.start.isValid();
    return (validation)
      ? null
      : { 'DateRangePickerStartDate': { 'invalid': true } };
  }

  private _validateEndDate: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
    const validation: boolean = !c.value || !c.value.end || c.value.end.isValid();
    return (validation)
      ? null
      : { 'DateRangePickerEndDate': { 'invalid': true } };
  }

  private _validateDateRange: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
    const validation: boolean = !c.value || (c.value.start && c.value.end && c.value.start.isSameOrBefore(c.value.end));
    return (validation)
      ? null
      : { 'DateRangePickerDateRange': { 'invalid': true } };
  }

  // tslint:disable-next-line:member-ordering
  private _validator: ValidatorFn | null = Validators.compose([
    this._validateStartDate, this._validateEndDate, this._validateDateRange]);

  constructor(@Optional() private _dateAdapter: DateAdapter<Moment>) {
  }

  public monthSelectedHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, isEnd?: boolean): void {
    if (this.mode === 'month') {
      this.changeValueAndClosePicker(normalizedMonth, datepicker, isEnd);
    }
  }

  public yearSelectedHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>, isEnd?: boolean): void {
    if (this.mode === 'year') {
      this.changeValueAndClosePicker(normalizedYear, datepicker, isEnd);
    }
  }

  public registerOnChange(fn: (value: DateRange) => void): void {
    this._onChanged = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(value: DateRange): void {
    this.value = value;
  }

  public registerOnValidatorChange(fn: () => void): void {
    this._onValidatorChanged = fn;
  }


  public validate(c: AbstractControl): ValidationErrors | null {
    return this._validator ? this._validator(c) : null;
  }

  public onChange(isEnd?: boolean): void {
    let start: Moment | null = (this._getValidDateOrNull(this.startDate)) ?
      this._getValidDateOrNull(this.startDate) :
      invalid();
    let end: Moment | null = (this._getValidDateOrNull(this.endDate)) ?
      this._getValidDateOrNull(this.endDate) :
      invalid();

    // @ts-ignore
    if (!isEnd && start!.isAfter(end)) {
      end = start;
    }

    // @ts-ignore
    if (!!isEnd && end!.isBefore(start)) {
      start = end;
    }

    // @ts-ignore
    this.value = momentWithRange.range(start, end);
    // @ts-ignore
    this._onChanged(this._value);
  }

  public onTouch(): void {
  }

  /**
   * @param obj The object to check.
   * @returns The given object if it is both a date instance and valid, otherwise null.
   */
  private _getValidDateOrNull(obj: Moment | Date): Moment | null {
    return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(moment(obj))) ? moment(obj) : null;
  }

  private changeValueAndClosePicker(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>, isEnd?: boolean): void {
    isEnd
      // @ts-ignore
      ? this.dateRangeForm.controls.validTo.patchValue(normalizedMonth, {emitEvent: false})
      // @ts-ignore
      : this.dateRangeForm.controls.validFrom.patchValue(normalizedMonth, {emitEvent: false});

    this.onChange(isEnd);
    datepicker.close();
  }

  private getStartView(): StartView {
    switch (this.mode) {
      case 'day': { return 'month'; }
      case 'month': { return 'year'; }
      case 'year': { return 'multi-year'; }
      default: { return 'month'; }
    }
  }
}
