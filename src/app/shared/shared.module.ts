import { NgModule, Provider } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { DateMonthFormatDirective, DateYearFormatDirective } from '@app/shared/directives/date-year-format.directive';
import { DateFormatPipe } from '@app/shared/pipes/date-time.pipe';
import { EnumPipe } from '@app/shared/pipes/enum.pipe';
import { InputContainerDecoratorDirective } from '@app/shared/directives/input-container-decorator.directive';
import { GridDirective } from '@app/shared/directives/grid.directive';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { TimeFormatService } from '@app/shared/services/time-format.service';
import { NgBusyModule } from 'ng-busy';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxMaskModule } from 'ngx-mask';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { PermissionPipe } from '@app/shared/pipes/permission.pipe';
import { UserPermissionsService } from '@app/shared/services/user-permissions.service';
import { ServerErrorsDirective } from '@app/shared/directives/server-errors.directive';
import { ServerErrorsService } from '@app/shared/services/form/server-errors.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputObjectDirective } from './directives/mat-input-object.directive';
import { FormatNumberPipe } from '@app/shared/pipes/format-number.pipe';
import { SearchService } from '@app/shared/services/search.service';
import { DisableControlDirective } from '@app/shared/directives/disable-control.directive';
import { AgGridService } from '@app/shared/services/ag-grid.service';
import { ResetMatSelectOnBackspaceDirective } from './directives/reset-mat-select-on-backspace.directive';
import { ClickStopPropagationDirective } from './directives/click-stop-propagation.directive';
import { OrderbyPipe } from '@app/shared/pipes/orderby.pipe';
import { AlertDialogComponent } from '@app/shared/components/alert-dialog/alert-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NumericLocalizationPipe } from '@app/shared/pipes/numeric-localization.pipe';
import { ValidationServiceUtil } from '@app/shared/services/validation-service-util.service';

const importExport = [ // tslint:disable-line
  CommonModule,
  FormsModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatRadioModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatDialogModule,
  MatRippleModule,
  MatBadgeModule,
  TranslateModule,
  ReactiveFormsModule,
  NgBusyModule,
  NgxMaskModule,
  DragDropModule,
  ScrollingModule,
  MatProgressBarModule,
];

const pipes = [ // tslint:disable-line
  DateFormatPipe,
  EnumPipe,
  PermissionPipe,
  FormatNumberPipe,
  NumericLocalizationPipe,
  OrderbyPipe
];

const exportedDeclaration = [ // tslint:disable-line
  ...pipes,
  DateYearFormatDirective,
  DateMonthFormatDirective,
  InputContainerDecoratorDirective,
  GridDirective,
  ConfirmDialogComponent,
  AlertDialogComponent,
  DateRangePickerComponent,
  ServerErrorsDirective,
  MatInputObjectDirective,
  DisableControlDirective,
  ResetMatSelectOnBackspaceDirective,
  ClickStopPropagationDirective,
];

const providers: Provider[] = [
  ...pipes,
  DatePipe,
  TimeFormatService,
  UserPermissionsService,
  SearchService,
  ServerErrorsService,
  AgGridService,
  ValidationServiceUtil
];

@NgModule({
  imports: [
    AgGridModule.withComponents([
    ]),
  ],

  declarations: [
    ...exportedDeclaration,
  ],

  exports: [
    AgGridModule,
    ...importExport,
    ...exportedDeclaration,
  ],

  providers: [
    ...providers
  ],
})
export class SharedModule {
}
