import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../../shared/shared.module';
import {OrdersProductCreateRoutingModule} from './orders-product-create-routing.module';
import {OrdersProductCreateComponent} from './orders-product-create.component';
import {DataFilterCustomerSearchPipe} from '../_pipe/data_filter-ordercsutomer.pipe';

import {SelectModule} from 'ng-select';
import {SelectOptionService} from '../../../shared/elements/select-option.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    OrdersProductCreateRoutingModule,
    SharedModule,
    SelectModule,
    TextMaskModule,
    NgbModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [
      OrdersProductCreateComponent,
      DataFilterCustomerSearchPipe
  ],
    providers: [SelectOptionService]
})
export class OrdersProductCreateModule { }
