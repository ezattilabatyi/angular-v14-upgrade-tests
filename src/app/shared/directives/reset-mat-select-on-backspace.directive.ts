import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[etrmResetMatSelectOnBackspace]'
})
export class ResetMatSelectOnBackspaceDirective {

  @Input() private etrmResetMatSelectOnBackspace!: boolean;

  constructor(private ngControl: NgControl) {
  }

  @HostListener('keydown.delete')
  @HostListener('keydown.backspace')
  public handleDelete(): void {
    if (this.etrmResetMatSelectOnBackspace !== false) {
      this.ngControl.control!.markAsDirty();
      this.ngControl.control!.patchValue(null);
    }
  }
}
