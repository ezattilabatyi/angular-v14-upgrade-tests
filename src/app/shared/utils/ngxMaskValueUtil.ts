import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';

export interface MaskValueValidatorOptions {
  min?: number;
  max?: number;
}

export class NgxMaskValueUtil {


  constructor() {
  }

  public static ngxMaskValueValidator(options: MaskValueValidatorOptions, translateService: TranslateService): ValidatorFn {

    return (control: AbstractControl): ValidationErrors | null => {

      let controlValue: string | number | null = control.value;

      if (typeof controlValue === 'string') {
        controlValue = this.ngxMaskValueParser(controlValue, translateService);
      }

      if (!!controlValue && !_.isNumber(controlValue)) {
        return {
          isNotNumber: true
        };
      }

      if (!_.isNil(options.min) && options!.min! > controlValue!) {
        return {
          min: true,
          maskValueExpected: options.min
        };
      } else if (!_.isNil(options.max) && options!.max! < controlValue!) {
        return {
          max: true,
          maskValueExpected: options.max
        };
      }

      return null;
    };
  }

  public static ngxMaskValueParser(value: string | number, translateService: TranslateService): number | null {
    if (typeof value === 'string') {

      if (value === '') {
        return null;
      }

      const customer: string = _.get(JSON.parse(localStorage.getItem('preload') as string), 'applicationInfo.customer', null);
      const decimalMarkerKey: string = customer === 'eac' ? 'eac.number.decimalMarker' : 'number.decimalMarker';
      const thousandSeparatorKey: string = customer === 'eac' ? 'eac.number.thousandSeparator' : 'number.thousandSeparator';

      const thousandSeparator: string = translateService.instant(thousandSeparatorKey);
      const decimalMarker: string = translateService.instant(decimalMarkerKey);
      const thousandSeparatorRegex: RegExp = new RegExp(`\\${thousandSeparator}`, 'g');

      value = value.replace(thousandSeparatorRegex, ''); // needs regex to remove from multiple places
      value = value.replace(decimalMarker, '.'); // only one occurrence, no need for regex
      value = parseFloat(value);

      return isNaN(value) ? null : value;
    } else {
      return value;
    }
  }

  public static getNumberMinMaxValidation(value: number, min: number, max: number): number {
    if (min > value) {
      value = Number(min);
    } else if (max < value) {
      value = Number(max);
    }

    return value;
  }
}
