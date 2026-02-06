import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';

export const localeKeys: { [key: string]: string; } = {
  en: 'en-GB',
  hu: 'hu',
  uk: 'ru-UA',
};

export const CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['DD/MM/YYYY', 'DD.MM.YYYY']
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: ' DD/MM/YYYY',
    monthYearA11yLabel: 'MMM YYYY'
  },
};

export const NGX_CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: ['DD/MM/YYYY HH:mm', 'DD.MM.YYYY HH:mm']
  },
  display: {
    dateInput: 'DD/MM/YYYY HH:mm',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: ' DD/MM/YYYY HH:mm',
    monthYearA11yLabel: 'MMM YYYY'
  },
};

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const YEAR_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MONTH_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'MMMM YYYY',
  },
  display: {
    dateInput: 'MMMM YYYY',
    monthYearLabel: 'MMM',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[etrmDateYearFormat]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: YEAR_DATE_FORMATS }
  ],
})
export class DateYearFormatDirective {
}

@Directive({
  selector: '[etrmDateMonthFormat]',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MONTH_DATE_FORMATS }
  ],
})
export class DateMonthFormatDirective {
}
