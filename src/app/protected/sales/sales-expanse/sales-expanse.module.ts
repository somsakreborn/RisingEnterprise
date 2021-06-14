import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesExpanseRoutingModule} from './sales-expanse-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {SalesExpanseComponent} from './sales-expanse.component';

@NgModule({
  imports: [
    CommonModule,
    SalesExpanseRoutingModule,
    SharedModule
  ],
  declarations: [
    SalesExpanseComponent
  ]
})
export class SalesExpanseModule { }
