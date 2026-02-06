import { Moment } from 'moment-timezone';

import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import {formatDate} from '@angular/common';
import { TimeZoneUtil } from '@app/shared/utils/time-zone.util';

export class DateUtil {

  private static LIMITLESS_YEAR: number = 2099;
  private static LIMITLESS_MONTH: number = 11;
  private static LIMITLESS_DAY: number = 31;

  private static OFFSET: number = 0;
  private static DEFAULT_DATE_LENGTH: number = 10;

  private static WEEKEND_DAYS: number[] = [0, 6]; // tslint:disable-line:no-magic-numbers

  public static LIMITLESS: Date = new Date(DateUtil.LIMITLESS_YEAR, DateUtil.LIMITLESS_MONTH, DateUtil.LIMITLESS_DAY);
  public static TODAY: Date = DateUtil.clearTime(DateUtil.currentDate());

  // Use a strict ISO 8601 regex (e.g., "2025-10-09" or "2025-10-09T13:45:00Z")
  private static ISO_DATE_REGEX: RegExp =
    /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+\-]\d{2}:\d{2})?)?$/;

  constructor(private timeZoneService: TimeZoneUtil) {
  }

  public static setServerTime(date: string): void {
    this.OFFSET = moment.duration(moment(date).diff(moment())).as('milliseconds');
  }

  public static isBetween(currentDate: Date,
                          start: Date,
                          end: Date,
                          granularity: moment.unitOfTime.StartOf,
                          inclusivity: '()' | '[)' | '(]' | '[]' = '[]'): boolean {
    return moment(currentDate).isBetween(moment(start), moment(end), granularity, inclusivity);
  }

  public static isWeekend(date: Date | string): boolean {
    if (!date) {
      return false;
    }

    return DateUtil.WEEKEND_DAYS.includes(new Date(date).getDay());
  }

  public static currentDate(timezoneId?: string): Date {
    return DateUtil._currentDate(timezoneId);
  }

  public static currentMoment(timezoneId?: string): Moment {
    return DateUtil._currentMoment(timezoneId);
  }

  public static currentDateTime(timezoneId?: string): Date {
    return DateUtil._currentDate(timezoneId, true);
  }

  public static tomorrow(): Date {
    return this.addDay(this.clearTime(this.currentDate()), 1);
  }

  public static tomorrowMoment(): Moment {
    return this.currentMoment().startOf('day').add(1, 'day');
  }

  // FIXME
  public static clearTime(date: Date | string): Date {
    const clearDate: Date = new Date(date);

    clearDate.setHours(0);
    clearDate.setMinutes(0);
    clearDate.setSeconds(0);
    clearDate.setMilliseconds(0);

    return clearDate;
  }

  public static clearMoment(date: moment.MomentInput): Moment {
    const clearDate: Moment = moment(date);

    return clearDate.startOf('day');
  }

  public static getDate(date: Date): Date {
    const result: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    return this.clearTime(result);
  }

  public static yearsBetween(firstDate: Date, secondDate: Date): number[] {
    const startYear: number = Math.min(firstDate.getFullYear(), secondDate.getFullYear());
    const endYear: number = Math.max(firstDate.getFullYear(), secondDate.getFullYear()) + 1;

    return _.range(startYear, endYear);
  }

  public static countBetween(firstDate: Date, secondDate: Date, unitOfTimeDiff: moment.unitOfTime.Diff = 'day'): number {
    return Math.abs(moment(firstDate).diff(moment(secondDate), unitOfTimeDiff));
  }

  public static createDate(date: moment.MomentInput): Date | null{
    return !!date ? moment(date).toDate() : null;
  }

  public static createZonedDateTime(date: moment.MomentInput, timezone?: string): any {
    const newDate: Moment = moment(date);

    if (!newDate.isValid()) {
      return null;
    }

    return  {
      dateTime: newDate.toDate() as unknown as string,
      zone: timezone || TimeZoneUtil.DEFAULT_TIME_ZONE
    };
  }

  private static calculateServerTime(): Moment {
    return moment().add(DateUtil.OFFSET, 'ms');
  }

  private static _currentMoment(timezoneId?: string, returnCurrentTime?: boolean): Moment {
    const serverTime: Moment = this.calculateServerTime();
    const serverTimeISO: string = serverTime.toISOString();

    if (!timezoneId) {
      return serverTime;
    }

    if (!returnCurrentTime) {
      serverTimeISO.slice(DateUtil.OFFSET, DateUtil.DEFAULT_DATE_LENGTH);
    }

    return moment.tz(serverTimeISO, timezoneId);
  }

  private static _currentDate(timezoneId?: string, returnCurrentTime?: boolean): Date {
    const serverTime: Date = this.calculateServerTime().toDate();
    const serverTimeISO: string = serverTime.toISOString();

    if (!timezoneId) {
      return serverTime;
    }

    if (!returnCurrentTime) {
      serverTimeISO.slice(DateUtil.OFFSET, DateUtil.DEFAULT_DATE_LENGTH);
    }

    return new Date(moment.tz(serverTimeISO, timezoneId).format());
  }

  public static addDate(date: moment.MomentInput = 0, field: moment.unitOfTime.Base = 'day', value: number = 1): Date {
    return !date ? DateUtil.currentDate() : moment(date).add(value, field).toDate();
  }

  public static addMinute(date: moment.MomentInput, minutes: number): Date {
    return this.addDate(date, 'minutes', minutes);
  }

  public static addHour(date: moment.MomentInput, hours: number): Date {
    return this.addDate(date, 'hours', hours);
  }

  public static addDay(date: moment.MomentInput, days: number): Date {
    return this.addDate(date, 'days', days);
  }

  public static addMonth(date: moment.MomentInput, months: number): Date {
    return this.addDate(date, 'months', months);
  }

  public static addYear(date: moment.MomentInput, years: number): Date {
    return this.addDate(date, 'years', years);
  }

  public static minDate(date1: Date, date2: Date): Date {
    return moment(date1).isAfter(date2) ? date2 : date1;
  }

  public static minMoment(date1: Moment, date2: Moment): Moment {
    return date1.isAfter(date2) ? date2 : date1;
  }

  public static maxDate(date1: Date, date2: Date): Date {
    return moment(date1).isBefore(date2) ? date2 : date1;
  }

  public static maxMoment(date1: Moment, date2: Moment): Moment {
    return date1.isBefore(date2) ? date2 : date1;
  }

  public static dateCompare(date1: Date, date2: Date): number {
    if (moment(date1).isSame(date2)) {
      return 0;
    }

    return moment(date1).isAfter(date2) ? 1 : -1;
  }

  public static momentCompare(date1: Moment, date2: Moment): number {
    if (date1.isSame(date2)) {
      return 0;
    }

    return date1.isAfter(date2) ? 1 : -1;
  }

  public static between(start: Date, end: Date, date: Date): boolean {
    return (start <= date) && (end >= date);
  }

  public static betweenMoment(start: Moment, end: Moment, date: Moment): boolean {
    return (start.isBefore(date) || start.isSame(date)) && (end.isAfter(date) || end.isSame(date));
  }

  public static today(): Date {
    return this.clearTime(this.currentDate());
  }

  public static isIsoDateString(value: unknown): value is string {
    return typeof value === 'string' && DateUtil.ISO_DATE_REGEX.test(value);
  }

  // FIXME timezone issue
  public static napKezdete(date: any): any {
    return DateUtil.createZonedDateTime(moment(date.dateTime).startOf('day'));
  }

  /**
   * returns the param in YYYY-MM-DD format
   */
  public static getISODate(date: Date | moment.Moment | string): string {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * returns the param in YYYY-MM-DDTHH:mm:ssZ format
   */
  public static getISODateTime(date: Date | moment.Moment | string, keepOffset: boolean = false): string {
    return moment(date).toISOString(keepOffset);
  }

  public static toDateString(date: Date | Moment): string | null {
    if (!date) {
      return null;
    }
    if (!(date instanceof Date)) {
      date = date.toDate();
    }
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

}

