import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import NumberFormatOptions = Intl.NumberFormatOptions;

@Pipe({
  name: 'formatNumber'
})
export class FormatNumberPipe implements PipeTransform {

  private static readonly CYPRUS_LOCALES: string = 'el-CY';
  private static readonly ENGLISH_LOCALES: string = 'en';
  private static readonly CYPRUS_CUSTOMER: string = 'eac';

  constructor() {}

  public transform(value: number, options: NumberFormatOptions = {}, lang: string = 'en'): string {

    if (value === null) {
      return '';
    }

    if (lang === FormatNumberPipe.ENGLISH_LOCALES) {
      lang = FormatNumberPipe.CYPRUS_LOCALES;
    }

    return Intl.NumberFormat(lang, options).format(value);
  }
}
