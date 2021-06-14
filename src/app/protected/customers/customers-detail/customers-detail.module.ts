import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersDetailRoutingModule} from './customers-detail-routing.module';
import {CustomersDetailComponent} from './customers-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {DataTableModule} from 'angular2-datatable';
import {DataFilterCustomerPipe} from '../_pipe/data-filter-customer.pipe';

import {NgxDatatableModule} from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    CustomersDetailRoutingModule,
    SharedModule,
    DataTableModule,
    NgxDatatableModule
  ],
  declarations: [
      CustomersDetailComponent,
      DataFilterCustomerPipe
  ]
})
export class CustomersDetailModule { }
