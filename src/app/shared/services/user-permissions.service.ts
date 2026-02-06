import {Injectable} from '@angular/core';

import * as _ from 'lodash';

@Injectable()
export class UserPermissionsService {
  protected userPermissions!: string[] | null;

  constructor() {
  }

  public getPermission(keys: string[]): boolean {
    return false;
  }

  public clear(): void {
    this.userPermissions = null;
  }
}
