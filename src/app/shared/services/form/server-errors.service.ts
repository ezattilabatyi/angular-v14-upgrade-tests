import { Injectable } from '@angular/core';
import { FieldValidationError, ServerErrors } from '@app/shared/types/shared.types';

import * as _ from 'lodash';

@Injectable()
export class ServerErrorsService {

  private static readonly VALIDITY: string = 'validity';
  private static readonly FROM: string = 'from';
  private static readonly VALID_FROM: string = 'validFrom';
  private static readonly TO: string = 'to';
  private static readonly VALID_TO: string = 'validTo';

  public serverErrors!: FieldValidationError[];

  private static fixPathName(error: FieldValidationError): FieldValidationError {
    if (!!error.path && (error.path === ServerErrorsService.FROM || error.path === ServerErrorsService.VALIDITY)) {
      error.path = ServerErrorsService.VALID_FROM;
    }

    if (!!error.path && error.path === ServerErrorsService.TO) {
      error.path = ServerErrorsService.VALID_TO;
    }

    return error;
  }

  constructor() {}

  public setServerErrors(errors: ServerErrors): FieldValidationError[] {
    if (!errors && !errors['fields']) {
      return [];
    }

    const errorList: FieldValidationError[] = errors.fields;
    this.serverErrors = [];

    errorList.forEach((error: FieldValidationError) => {
      error = ServerErrorsService.fixPathName(error);

      this.serverErrors.push({
        path: _.camelCase(error.path),
        code: error.code,
        args: error.args
      });
    });

    return this.serverErrors;
  }

}
