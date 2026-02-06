import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment-timezone';
import { TimeFormatService } from '@app/shared/services/time-format.service';

@Pipe({
  name: 'dateFormatPipe'
})
export class DateFormatPipe implements PipeTransform {

  constructor() {
  }

  public transform(date: Date | string | moment.Moment): string {
    if (!date) {
      return '';
    }

    return moment(date).format(TimeFormatService.DATE_FORMAT_MOMENT);
  }
}

