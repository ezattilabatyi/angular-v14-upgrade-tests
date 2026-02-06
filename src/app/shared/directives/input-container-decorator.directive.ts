import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  Injector,
  QueryList,
  Renderer2,
  Input
} from '@angular/core';
import { NgControl, ValidationErrors } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateService } from '@ngx-translate/core';

import * as _ from 'lodash';

@Directive({
  selector: 'mat-form-field', // tslint:disable-line
})
export class InputContainerDecoratorDirective implements AfterContentInit {

  private static COMMON_VALIDATION_KEYS: string[] = ['required', 'max', 'min', 'isnotnumber'];

  @Input()
  private controlName!: string;

  @ContentChildren(NgControl)

  public models!: QueryList<NgControl>;
  private errorContainer!: Node;
  private errorNodes: Node[] = [];
  private errorElement!: HTMLElement;
  private matTooltip!: MatTooltip;

  private static getInterpolateParams(control: NgControl): ValidationErrors {
    // @ts-ignore
    const errorKey: string = _.first(_.keys(control.errors));

    const interpolation: object = {};

    // @ts-ignore
    if (_.isArray(control.errors[errorKey]) && !_.isEmpty(control.errors[errorKey])) {
      // @ts-ignore
      control.errors[errorKey].forEach((arg: string, i: number) => {
        // @ts-ignore
        interpolation[`${ i + 1}`] = arg;
      });
    } else {
      // @ts-ignore
      return control.errors[errorKey];
    }

    return interpolation;
  }

  constructor(private inputContainer: ElementRef,
              private renderer: Renderer2,
              private translate: TranslateService,
              private injector: Injector) {
  }

  public ngAfterContentInit(bool?: boolean): void {
    setTimeout(() => {
      this.errorContainer = this.inputContainer.nativeElement.querySelector('.mat-form-field-hint-spacer');

      if (this.inputContainer.nativeElement.hasAttribute('matTooltip')) {
        this.matTooltip = this.injector.get(MatTooltip);
      }

      if (!!this.models && !!this.models.first) {
        this.setInputError(this.models.first);

        // @ts-ignore
        this.models.first.control.valueChanges.subscribe(() => {
          this.setInputError(this.models.first);
        });
      }
    });
  }

  private setInputError(control: NgControl): void {
    if (!this.errorContainer) {
      return;
    }

    this.errorNodes.forEach((node: Node) => this.renderer.removeChild(this.renderer.parentNode(node), node));

    const showedErrors: string[] = Object.keys(control.errors || {});
    const fieldName: string = (this.controlName || control.name) as string;

    if (showedErrors.length === 0) {
      this.updateTooltip(null);
      return;
    }

    let errorText: string;
    const errorMessage: string = _.first(showedErrors) as string;
    const errorKey: string = errorMessage.toLowerCase();
    const interpolateParams: ValidationErrors = InputContainerDecoratorDirective.getInterpolateParams(control);

    let key: string;

    if (_.includes(InputContainerDecoratorDirective.COMMON_VALIDATION_KEYS, errorKey)) {
      key = errorKey;
    } else {
      key = `${fieldName}.${errorKey}`;
    }

    errorText = this.translate.instant(`errorCodes.${fieldName}.${errorKey}`, interpolateParams);

    if (errorText === `errorCodes.${fieldName}.${errorKey}`) {
      errorText = this.translate.instant(`errorCodes.${key}`, interpolateParams);
    }

    if (errorText === `errorCodes.${key}`) {
      errorText = this.translate.instant(errorMessage, interpolateParams);
    }

    this.appendErrorElement(errorText);
    this.updateTooltip(errorText);
  }

  private appendErrorElement(errorText: string): void {
    this.errorElement = this.renderer.createElement('mat-error');
    this.errorNodes.push(this.errorElement);
    this.renderer.addClass(this.errorElement, 'mat-error');
    this.renderer.addClass(this.errorElement, 'ips-error');
    this.renderer.setProperty(this.errorElement, 'innerHTML', errorText);
    this.renderer.appendChild(this.errorContainer, this.errorElement);
  }

  private updateTooltip(errorText: string | null): void {
    if (!!this.matTooltip) {
      this.matTooltip.message = errorText as string;
      this.matTooltip.disabled = !errorText;
    }
  }

  @HostListener('mouseover')
  public updateTooltipVisibility(): void {
    if (!!this.matTooltip) {
      this.matTooltip.disabled = this.inputContainer.nativeElement.clientWidth >= _.get(this.errorElement, 'scrollWidth', 0);
    }
  }
}
