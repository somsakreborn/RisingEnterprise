import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../../shared/shared.module';
import {OrdersProductEditRoutingModule} from './orders-product-edit-routing.module';
import {OrdersProductEditComponent} from './orders-product-edit.component';

import {SelectModule} from 'ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';

import {TextMaskModule} from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    OrdersProductEditRoutingModule,
    SharedModule,
    SelectModule,
    TextMaskModule,
    NgbModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [OrdersProductEditComponent]
})
export class OrdersProductEditModule { }
