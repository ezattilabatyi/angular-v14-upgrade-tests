import {Injectable} from '@angular/core';
import {AbstractControl, UntypedFormGroup} from '@angular/forms';
import {FormUtil} from '@app/shared/utils/form.util';

@Injectable()
export class ValidationServiceUtil {

  public setErrorsFieldsOnGroup(fields: { path: string, code: string }[], formGroup: UntypedFormGroup): void {
    if (!fields || fields.length === 0) {
      return;
    }
    fields.forEach((it: { path: string, code: string }) => this.setFormError(it, formGroup));
  }

  private setFormError(it: { path: string, code: string }, formGroup: UntypedFormGroup): void {
    const control: AbstractControl | null = FormUtil.findControl(formGroup, it.path);
    if (!control) {
      return;
    }
    const error: { [key: string]: any } = {};
    error[it.code] = true;
    control.setErrors(error);
  }
}
