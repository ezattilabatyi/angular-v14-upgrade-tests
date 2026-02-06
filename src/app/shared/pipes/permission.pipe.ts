import { Pipe, PipeTransform } from '@angular/core';
import { UserPermissionsService } from '@app/shared/services/user-permissions.service';

@Pipe({name: 'permission'})

export class PermissionPipe implements PipeTransform {

  constructor(public userPermissionsService: UserPermissionsService) {
  }

  public transform(permissionKeys: string | string[]): boolean {
    const permissions: string[] = typeof permissionKeys === 'string' ? [permissionKeys] : permissionKeys;

    return this.userPermissionsService.getPermission(permissions);
  }

}
