import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { AppState } from '@app/core/core.state';
import { applicationInfoSelector } from '@app/core/settings/settings.selectors';
import { isLoggedIn } from '@app/core/auth/auth.selectors';
import { Preload } from '@app/core/settings/settings.actions';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialog } from '@app/shared/components/confirm-dialog/confirm-dialog.types';
import { Logout } from '@app/core/auth/auth.actions';
import { HttpStatusCode } from '@app/core/http-interceptors/http-status-code.type';
import { Router } from '@angular/router';

@Injectable()
export class SessionCountdownService {

  private sessionTimeoutSeconds: number;
  private isLoggedIn: boolean;
  private _warnPopupTimeoutID: number;

  private _logoutTimeoutID: number;

  /**
   * the time before the session expires and a warning popup shows up
   */
  private readonly _warnUserBeforeSessionTimeoutSeconds: number = 60;
  private readonly MILLISECONDS: number = 1000;

  constructor(private store: Store<AppState>,
              private router: Router,
              private dialog: MatDialog) {
    this.initSessionCountdownValues();
  }

  private initSessionCountdownValues(): void {
    this.store.pipe(
      select(applicationInfoSelector),
    ).subscribe((appInfo: Record<string, unknown>) => {
      this.sessionTimeoutSeconds = appInfo && appInfo.sessionTimeout as number;
    });

    this.store.pipe(
      select(isLoggedIn)
    ).subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  public handleRequest<T>(event: HttpResponse<T> | number): void {
    if (this.isSessionCountdownRefreshNeeded(event)) {
      this.refreshSessionCountdown();
    } else {
      this.clearCountdown();
    }
  }

  private refreshSessionCountdown(): void {
    this.clearCountdown();

    if (!this.isLoggedIn || !this.sessionTimeoutSeconds) {
      return;
    }

    this._warnPopupTimeoutID = setTimeout(() => {
      // this.logoutIfInactiveCountdown();

      // do not use the confirm method from sharedService, that one calls a preload which would break the countdown
      const confirmDialogRef: MatDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        disableClose: true,
        autoFocus: false,
        data: {
          title: 'core.popup.CONFIRMATION_TITLE',
          content: 'User.Session.Timeout',
          confirmButtonText: 'common.button.ok',
          hide: {
            cancelButton: true
          }
        } as ConfirmDialog.Data
      });

      confirmDialogRef.afterClosed().subscribe((confirmed: boolean | string) => {
        // close (x) button emits an empty string ...
        if (confirmed || confirmed === '') {
          this.store.dispatch(new Preload());
        } else {
          // in case the cancel button will be shown some day
          this.store.dispatch(new Logout());
        }
      });

    }, this.getTimeoutDuration()) as unknown as number;
  }

  public clearCountdown(): void {
    clearTimeout(this._warnPopupTimeoutID);
    // clearTimeout(this._logoutTimeoutID);
  }

  private getTimeoutDuration(): number {
    return (this.sessionTimeoutSeconds - this._warnUserBeforeSessionTimeoutSeconds) * this.MILLISECONDS;
  }

  private isSessionCountdownRefreshNeeded<T>(event: HttpResponse<T> | number): boolean {
    return (typeof event === 'number' && this.isResponseStatusAllowed(event))
      || (event instanceof HttpResponse && this.isResponseStatusAllowed(event.status));
  }

  private isResponseStatusAllowed(httpStatusCode: number): boolean {
    return ![HttpStatusCode.Unauthorized, HttpStatusCode.NotFound]
      .includes(httpStatusCode);
  }

  /**
   * add this back in case the user has to be logged out after the last minute expires
   * note: multiple tabs have to be handled then
   * (could save the time of the last successful request to local storage and decide by that the value of this.getTimeoutDuration())
   */
  // private logoutIfInactiveCountdown(): void {
  //   this._logoutTimeoutID = setTimeout(() => {
  //     this.store.dispatch(new Logout());
  //   }, this._warnUserBeforeSessionTimeoutSeconds * this.MILLISECONDS);
  // }
}
