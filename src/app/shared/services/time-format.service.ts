import {Injectable} from '@angular/core';
import {DateUtil} from '@app/shared/utils/date.util';

import 'moment-timezone';

import * as moment from 'moment';
import {Moment} from 'moment';
import * as _ from 'lodash';

@Injectable()
export class TimeFormatService {
  public static FOURTH_QUARTER_NUMBER: number = 4;
  public static DATE_FORMAT: string = 'DD/MM/YYYY';
  public static YEAR_MONTH_FORMAT: string = 'MM/YYYY';
  public static YEAR_FORMAT: string = 'YYYY';
  public static DATE_TIME_FORMAT: string = 'dd/MM/yyyy HH:mm';
  public static TIME_FORMAT: string = 'HH:mm';
  public static MONTH_FORMAT: string = 'MMMM';
  public static MONTH_YEAR_FORMAT: string = 'MMMM YYYY';
  public static DATE_FORMAT_MOMENT: string = 'DD/MM/YYYY';
  public static DATE_TIME_FORMAT_MOMENT: string = 'DD/MM/YYYY HH:mm';
  public static DATE_TIME_SECONDS_FORMAT_MOMENT: string = 'DD/MM/YYYY HH:mm:ss';

  private static TIME_FRAME_DAILY: number = 365;
  private static TIME_FRAME_WEEKLY: number = 52;
  private static TIME_FRAME_MONTHLY: number = 12;
  private static TIME_FRAME_QUARTERYEARLY: number = 4;
  private static TIME_FRAME_YEARLY: number = 1;
  private static TIME_FRAME_SEASON: number = 2;
  private static TIME_FRAME_DEFAULT: number = 0;

  private static FIRST_MONTH_NUMBER: number = 1;
  private static LAST_MONTH_NUMBER: number = 12;
  private static FIRST_QUARTER_NUMBER: number = 1;
  private static SECOND_QUARTER_NUMBER: number = 2;
  private static THIRD_QUARTER_NUMBER: number = 1;

  public static getOneYearInterval(timeFrameCode: string): number {
    switch (timeFrameCode) {
      case 'DAILY' :
        return TimeFormatService.TIME_FRAME_DAILY;
      case 'WEEKLY' :
        return TimeFormatService.TIME_FRAME_WEEKLY;
      case 'MONTHLY' :
        return TimeFormatService.TIME_FRAME_MONTHLY;
      case 'QUARTERYEARLY' :
        return TimeFormatService.TIME_FRAME_QUARTERYEARLY;
      case 'YEARLY' :
        return TimeFormatService.TIME_FRAME_YEARLY;
      case 'SEASON' :
        return TimeFormatService.TIME_FRAME_SEASON;
      default :
        return TimeFormatService.TIME_FRAME_DEFAULT;
    }
  }

  public static getMonthNumbers(): number[] {
    return _.range(TimeFormatService.FIRST_MONTH_NUMBER, TimeFormatService.LAST_MONTH_NUMBER + 1);
  }

  public static getQuarterNumbers(): number[] {
    return _.range(TimeFormatService.FIRST_QUARTER_NUMBER, TimeFormatService.FOURTH_QUARTER_NUMBER + 1);
  }

  constructor() {
  }

  public zoneDateTimeToDate(zonedDateTime: string): Date {
    return moment(zonedDateTime).toDate();
  }

  public getQuarterNumber(date: Date): number {
    // tslint:disable:no-magic-numbers
    if (DateUtil.yearsBetween(new Date(date.getFullYear(), 0, 1), new Date(date.getFullYear(), 2, 31))) {
      return TimeFormatService.FIRST_QUARTER_NUMBER;
    }
    if (DateUtil.yearsBetween(new Date(date.getFullYear(), 3, 1), new Date(date.getFullYear(), 5, 30))) {
      return TimeFormatService.SECOND_QUARTER_NUMBER;
    }
    if (DateUtil.yearsBetween(new Date(date.getFullYear(), 6, 1), new Date(date.getFullYear(), 8, 30))) {
      return TimeFormatService.THIRD_QUARTER_NUMBER;
    }
    if (DateUtil.yearsBetween(new Date(date.getFullYear(), 9, 1), new Date(date.getFullYear(), 11, 31))) {
      return TimeFormatService.FOURTH_QUARTER_NUMBER;
    }
    return 0; // should never return with 0
    // tslint:enable:no-magic-numbers
  }

  public formatTimeStamp(time: Date | Moment | string): string {
    return !!time ? moment(time).format(TimeFormatService.DATE_FORMAT_MOMENT) : '';
  }

  public dateTimeFormat(date: Date | Moment| string): string {
    return !!date ? moment(date).format(TimeFormatService.DATE_TIME_FORMAT_MOMENT) : '';
  }

  public dateTimeSecondsFormat(date: Date | Moment | string): string {
    return !!date ? moment(date).format(TimeFormatService.DATE_TIME_SECONDS_FORMAT_MOMENT) : '';
  }

  public timeFormat(date: Date | Moment | string): string {
    return !!date ? moment(date).format(TimeFormatService.TIME_FORMAT) : '';
  }

  public monthFormat(date: Date | Moment | string): string {
    return !!date ? moment(date).format(TimeFormatService.MONTH_FORMAT) : '';
  }

  public monthYearFormat(date: Date | Moment | string): string {
    return !!date ? moment(date).format(TimeFormatService.MONTH_YEAR_FORMAT) : '';
  }

}
