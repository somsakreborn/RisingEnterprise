import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../../shared/shared.module';

import {OrdersProductCheckRoutingModule} from './orders-product-check-routing.module';
import {OrdersProductCheckComponent} from './orders-product-check.component';

import {SelectModule} from 'ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  declarations: [OrdersProductCheckComponent],
  imports: [
    CommonModule,
    OrdersProductCheckRoutingModule,
    SharedModule,
    SelectModule,
    NgbModule,
    TypeaheadModule.forRoot(),
    TextMaskModule
  ]
})
export class OrdersProductCheckModule { }
