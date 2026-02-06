import { Injectable } from '@angular/core';
import { AbstractControl, UntypedFormControl } from '@angular/forms';
import { FormatNumberPipe } from '@app/shared/pipes/format-number.pipe';

@Injectable()
export class FormFieldsService {

  private readonly MAX_WHOLE_NUMBERS_LENGTH: number = 20;
  private readonly MAX_DECIMAL_LENGTH: number = 16;

  constructor(private formatNumberPipe: FormatNumberPipe) {}

  public onBlurFormatNumberInput(control: UntypedFormControl | AbstractControl,
                                 maximumFractionDigits?: number,
                                 maxWholeNumbers?: number,
                                 allowNegative?: boolean,
                                 emitEvent?: boolean): void {
    let formValue: number = control.value;

    if (!Number.isFinite(formValue)) {
      control.setValue(null, { emitEvent: emitEvent || false });
      return;
    }

    if (!allowNegative) {
      formValue = Math.abs(formValue);
    }

    // reduces the fractional digits and makes sure the decimal character is a dot (en)
    let value: string = this.formatNumberPipe.transform(formValue, {
      maximumFractionDigits: maximumFractionDigits || this.MAX_DECIMAL_LENGTH,
      useGrouping: false
    }, 'en');

    const split: string[] = value.split('.');
    split[0] = split[0].substr(0, maxWholeNumbers || this.MAX_WHOLE_NUMBERS_LENGTH);
    value = split.join('.');

    control.setValue(parseFloat(value), { emitEvent: emitEvent || false });
  }
}
