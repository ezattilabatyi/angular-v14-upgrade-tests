import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[etrmClickStopPropagation]'
})
export class ClickStopPropagationDirective {

  @Input() public etrmClickStopPropagation!: boolean;

  constructor() { }

  @HostListener('click', ['$event'])
  public stopPropagation($event: MouseEvent): void {
    if (this.etrmClickStopPropagation !== false) {
      $event.stopPropagation();
    }
  }
}
