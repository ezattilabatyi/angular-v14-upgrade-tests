import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'numericLocalization',
  pure: false
})

export class NumericLocalizationPipe implements PipeTransform {

  constructor(private translateService: TranslateService) {
  }

  public transform(key: string): string {
    if (key === 'number.thousandSeparator') {
      key = 'eac.number.thousandSeparator';
    } else if (key === 'number.decimalMarker') {
      key = 'eac.number.decimalMarker';
    }

    return this.translateService.instant(key);
  }
}
