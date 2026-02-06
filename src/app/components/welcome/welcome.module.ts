import {NgModule} from '@angular/core';
import {WelcomeComponent} from './welcome.component';
import {WelcomeRoutingModule} from '@components/welcome/welcome-routing.module';
import {AgGridModule} from 'ag-grid-angular';
import {SharedModule} from '@shared/shared.module';


@NgModule({
  declarations: [
    WelcomeComponent,
  ],
  imports: [
    WelcomeRoutingModule,
    SharedModule,
    AgGridModule,
  ],
  providers: [
  ]
})
export class WelcomeModule {
}
