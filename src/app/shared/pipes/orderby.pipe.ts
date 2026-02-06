import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'orderby'})
export class OrderbyPipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    return records.sort(function (a, b) {
      let direction: number = (args.direction ? (args.direction === 'ASC' ? 1 : -1) : 0);
      if (a[args.property].toLowerCase() < b[args.property].toLowerCase()) {
        return -1 * direction;
      } else if (a[args.property].toLowerCase() > b[args.property].toLowerCase()) {
        return 1 * direction;
      } else {
        return 0;
      }
    });
  };
}
