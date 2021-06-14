import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesRoutingModule} from './sales-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {SalesComponent} from './sales.component';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule
  ],
  declarations: [
    SalesComponent
  ]
})
export class SalesModule {
}
