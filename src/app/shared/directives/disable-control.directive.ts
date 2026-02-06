import { NgControl } from '@angular/forms';
import {
  Directive,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[etrmDisableControl]'
})
export class DisableControlDirective implements OnChanges {

  @Input()
  private etrmDisableControl!: boolean;

  constructor(private ngControl: NgControl) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    const condition: SimpleChange = changes.etrmDisableControl.currentValue;
    // @ts-ignore
    if (condition && !this.ngControl.control.disabled) {
      // @ts-ignore
      this.ngControl.control.disable({ emitEvent: false });
      // @ts-ignore
    } else if (!condition && !this.ngControl.control.enabled) {
      // @ts-ignore
      this.ngControl.control.enable({ emitEvent: false });
    }
  }

}
