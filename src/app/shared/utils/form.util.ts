import { AbstractControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

import * as _ from 'lodash';

export class FormUtil {

  public static findControl(formGroup: UntypedFormGroup, fieldName: any, isGroup: boolean = false): AbstractControl | null {
    if (!formGroup) {
      return null;
    }

    for (const prop of _.keys(formGroup.controls)) {
      const control: AbstractControl | null = formGroup.get(prop);

      if (prop === _.lowerFirst(fieldName) && (control instanceof UntypedFormControl || isGroup)) {
        return control;
      } else if (control instanceof UntypedFormGroup) {
        const result: AbstractControl | null = this.findControl(control, fieldName);

        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  public static validateAllFormFields(formGroup: UntypedFormGroup): void {
    _.keys(formGroup.controls).forEach((field: string) => {
      const control: AbstractControl | null = formGroup.get(field);
      if (control instanceof UntypedFormControl) {
        control.markAsTouched({ onlySelf: true });
        control.updateValueAndValidity({ onlySelf: true });
      } else if (control instanceof UntypedFormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
