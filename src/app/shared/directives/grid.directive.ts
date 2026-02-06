import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'ag-grid-angular' // tslint:disable-line
})
export class GridDirective {

  @HostBinding('class')
  public elementClass: string = 'ag-theme-balham';

  constructor() {}
}
