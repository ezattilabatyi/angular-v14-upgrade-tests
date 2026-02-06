import { Directive, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FieldValidationError } from '@app/shared/types/shared.types';

import { ServerErrorsService } from '@app/shared/services/form/server-errors.service';
import { HttpErrorResponse } from '@angular/common/http';

import * as _ from 'lodash';

@Directive({
  selector: '[etrmServerErrors]'
})
export class ServerErrorsDirective implements OnChanges {

  @Input()
  private formGroup!: UntypedFormGroup;

  @Input()
  private etrmServerErrors!: HttpErrorResponse;

  private serverErrors!: FieldValidationError[];

  constructor(private serverErrorsService: ServerErrorsService) {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    // @ts-ignore
    const errors: SimpleChange = changes.etrmServerErrors;

    if (!errors) {
      return;
    }

    if (errors.currentValue) {
      this.serverErrors = this.serverErrorsService.setServerErrors(errors.currentValue);
      errors.currentValue = this.serverErrors;
    } else {
      this.serverErrors = [];
    }

    if (errors.previousValue) {
      errors.previousValue = this.serverErrorsService.setServerErrors(errors.previousValue);
    }

    const formData: object = this.formGroup.getRawValue();

    for (const item of errors.previousValue || []) {
      // @ts-ignore
      const control: AbstractControl = this.getControlByName(formData, item.path);
      if (control) {
        control.updateValueAndValidity();
      }
    }

    for (const item of errors.currentValue || []) {
      // @ts-ignore
      const control: AbstractControl = this.getControlByName(formData, item.path);
      if (control) {
        errors.previousValue = control.value;

        const validator: ValidatorFn = (): ValidationErrors => {
          const currentValue: AbstractControl = control.value;

          const filteredErrors: FieldValidationError[] = (this.serverErrors || []).filter(
            (i: FieldValidationError) => i.path === item.path
          );

          if (filteredErrors.length > 0 && currentValue === errors.previousValue) {
            return filteredErrors.reduce((err: ValidationErrors, it: FieldValidationError) => {
              err[it.code] = it.args || true;
              return err;
            }, {});
          }
          // @ts-ignore
          return undefined;
        };

        // @ts-ignore
        control.setValidators([control.validator, validator]);
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    }
  }

  private getControlByName(formData: object, controlName: string): AbstractControl | null {
    const groupKey: string = _.findKey(formData, controlName) as string;

    if (!!groupKey) {
      return this.formGroup.controls[groupKey].get(controlName);
    } else if (_.keys(formData).indexOf(controlName) !== -1) {
      return this.formGroup.get(controlName);
    }

    return null;
  }
}
