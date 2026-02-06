import { Directive, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { MAT_INPUT_VALUE_ACCESSOR } from '@angular/material/input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';

@Directive({
  selector: '[etrmMatInputObject]',
  providers: [
    {
      provide: MAT_INPUT_VALUE_ACCESSOR,
      useExisting: MatInputObjectDirective
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatInputObjectDirective),
      multi: true,
    }
  ],
})
export class MatInputObjectDirective<T> {

  private _value!: T;

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  @Input('etrmMatInputObject') private shownProperty: string = 'id';

  @Input('value')
  set value(value: T) {
    this._value = value;
    this.formatValue(value);
  }
  get value(): T {
    return this._value;
  }

  @Output() private inputClicked: EventEmitter<void> = new EventEmitter<void>();

  public onChange(value: T): void {
  }

  public writeValue(value: T): void {
    this.value = value;
  }

  public registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(): void {
  }

  private formatValue(value: T): void {
    this.elementRef.nativeElement.value = _.get(value, this.shownProperty, '');
  }

  @HostListener('click')
  public onClick(): void {
    this.inputClicked.emit();
  }
}
