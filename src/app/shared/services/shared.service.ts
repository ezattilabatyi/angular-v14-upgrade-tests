import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material/snack-bar';
import {
  DECIMALS_PRICE,
  DECIMALS_QUANTITY,
  LONG_TEXTAREA_MAX_LENGTH,
  MEDIUM_TEXTAREA_MAX_LENGTH,
  SnackbarTiming,
  SnackBarType,
  TEXT_INPUT_LENGTH,
  TEXT_INPUT_MAX_LENGTH,
  TEXTAREA_MAX_LENGTH,
  TEXTAREA_MAX_ROWS_NUMBER,
  TEXTAREA_MIN_ROWS_NUMBER
} from '@app/shared/types/shared.types';
import {Observable, of, Subscription} from 'rxjs';
import {HttpParams} from '@angular/common/http';
import {ConfirmDialogComponent} from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {
  ValidationErrorWindowComponent
} from '@app/shared/components/validation-error-window/validation-error-window.component';

import * as _ from 'lodash';
import {Store} from '@ngrx/store';
import {AppState} from '@app/core/core.state';
import {Preload} from '@app/core/settings/settings.actions';

@Injectable()
export class SharedService {

  private routerData: object;
  private helpUrl: string;
  private subscriptions: Subscription[] = [];
  private _forceCanLeave: boolean = false;

  constructor(private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private store: Store<AppState>,
              private translate: TranslateService) {
  }

  public snackBarMessage(message: string, error?: boolean, duration: number = SnackbarTiming.normal): Observable<MatSnackBarDismiss> {
    return this.snackBar.open(this.translate.instant(message), '', {
      panelClass: error ? 'ips-snackbar--warn' : '',
      duration: duration
    }).afterDismissed();
  }

  public snackBarMessageWithType(message: string, snackBarType?: SnackBarType,
                                 duration: number = SnackbarTiming.normal): Observable<MatSnackBarDismiss> {
    return this.snackBar.open(this.translate.instant(message), '', {
      panelClass: this.getSnackBarClassName(snackBarType),
      duration: duration
    }).afterDismissed();
  }

  public get getTextFieldDefaultLength(): number {
    return TEXT_INPUT_LENGTH;
  }

  public get getTextFieldMaxLength(): number {
    return TEXT_INPUT_MAX_LENGTH;
  }

  public get getTextareaMinRows(): number {
    return TEXTAREA_MIN_ROWS_NUMBER;
  }

  public get getTextareaMaxRows(): number {
    return TEXTAREA_MAX_ROWS_NUMBER;
  }

  public get getTextareaMaxlength(): number {
    return TEXTAREA_MAX_LENGTH;
  }

  public get getMediumTextareaMaxlength(): number {
    return MEDIUM_TEXTAREA_MAX_LENGTH;
  }

  public get getLongTextareaMaxlength(): number {
    return LONG_TEXTAREA_MAX_LENGTH;
  }

  public get getDecimalsQuantity(): number {
    return DECIMALS_QUANTITY;
  }

  public get getDecimalsPrice(): number {
    return DECIMALS_PRICE;
  }

  public getCleanHttpParams(params: object): HttpParams {
    // HttpParams does not allow null or undefined parameter values

    if (!params) {
      return null;
    }

    params = this.getCleanObject(params);

    return Object.getOwnPropertyNames(params)
      .reduce((p: HttpParams, key: string) => p.set(key, params[key]), new HttpParams());
  }

  public getCleanObject(object: object): object {
    _.keys(object).forEach((key: string) => (object[key] == null || object[key] === '') && delete object[key]);
    return object;
  }

  public forceCanLeave(forceCanLeave: boolean): void {
    this._forceCanLeave = forceCanLeave;
  }

  public canLeaveDialog(promptText?: string, promptTextParams?: object): Observable<boolean> {
    this.store.dispatch(new Preload());

    if (this._forceCanLeave) {
      this._forceCanLeave = false;
      return of(true);
    }

    return this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {
        title: promptText ? 'core.popup.CONFIRMATION_TITLE' : 'common.confirm.leave.title',
        content: promptText || 'common.confirm.leave.content',
        contentParams: promptTextParams,
      }
    }).afterClosed();
  }

  public confirmDialogCallback(promptText: string, successCallback: Function, cancelCallback?: Function, promptTextParams?: object): void {
    this.canLeaveDialog(promptText, promptTextParams).subscribe((confirmed: boolean) => {
      if (confirmed) {
        successCallback();
      } else if (cancelCallback) {
        cancelCallback();
      }
    });
  }

  public errorDialog<T>(errors: T): Observable<boolean> {
    let errorList: T = null;
    let list: { code: string, type: string }[] = null;

    if (typeof errors === 'string') {
      list = [{ code: errors, type: 'ERROR' }];
    } else if (Array.isArray(errors) && errors.every(it => typeof it === 'string')) {
      list = errors.map((it: string) => ({ code: it, type: 'ERROR' }));
    } else if (_.has(errors, 'fields')) {
      errorList = _.get(errors, 'fields', []);
    } else {
      const textDecoder: TextDecoder = new TextDecoder('utf-8');
      errors = JSON.parse(textDecoder.decode(errors as undefined as ArrayBuffer));
      errorList = _.get(errors, 'fields', []);
    }

    if (!errorList && !list) {
      return of(true);
    }

    return this.dialog.open(ValidationErrorWindowComponent, {
      width: '666px',
      disableClose: true,
      autoFocus: false,
      data: errorList || list
    }).afterClosed();
  }

  public setRouterData(data: object): void {
    this.routerData = data;
    this.subscriptions = [];
    this.setHelpUrl();
  }

  public getRouterData(): object {
    return this.routerData;
  }

  public setSpinnerSubscriptions(...subscription: Subscription[]): void {
    this.subscriptions.push(...subscription);
  }

  public getSpinnerSubscriptions(): object {
    return { busy: [...this.subscriptions] };
  }

  public openHelp(): void {
    window.open(this.helpUrl, '_blank');
  }

  private setHelpUrl(): void {
    // needed because js pages
    const fixedHelpUrls: string[] = [];
    fixedHelpUrls['app_administration_scheduling-history'] = 'app_scheduler_history';
    fixedHelpUrls['app_administration_scheduling-jobs'] = 'app_scheduler';
    fixedHelpUrls['app_administration_administration-wslog'] = 'app_administration_wslog';
    fixedHelpUrls['app_administration_emaillog'] = 'app_administration_email_log';
    fixedHelpUrls['app_administration_email-templates'] = 'app_administration_email_templates';
    fixedHelpUrls['app_administration_pdf-templates'] = 'app_administration_pdf_templates';

    let help: string = this.routerData instanceof Array
      ? this.routerData.map(x => x.path).reduce((a, b) => a + '_' + b, 'app')
      : _.get(this.routerData, 'help', 'Introduction');

    help = fixedHelpUrls[help] ? fixedHelpUrls[help] : help;

    const lang: string = this.translate.currentLang.toUpperCase();
    this.helpUrl = `help/Etrm-help_${ lang }.html#${ help }`;
  }

  public getUID(joinPartsWith: string = '-'): string {
    // tslint:disable:no-magic-numbers
    // tslint:disable:no-bitwise
    const uid: string[] = _.times(8, () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    });
    // tslint:enable

    return _.toUpper(uid.join(joinPartsWith));
  }

  private getSnackBarClassName(snackBarType: SnackBarType): string {
    switch (snackBarType) {
      case "success":
        return 'ips-snackbar--success';
      case "error":
        return 'ips-snackbar--warn';
      default:
        return 'ips-snackbar--primary';
    }
  }
}
