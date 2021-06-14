import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrdersProductRoutingModule} from './orders-product-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {OrdersProductComponent} from './orders-product.component';

// import {NgxDatatableModule} from '@swimlane/ngx-datatable';

// Import ngx-barcode module
import {NgxBarcodeModule} from 'ngx-barcode';

@NgModule({
  imports: [
    CommonModule,
    OrdersProductRoutingModule,
    // NgxDatatableModule,
    SharedModule,
    NgxBarcodeModule
  ],
  declarations: [
    OrdersProductComponent
  ]
})
export class OrdersProductModule { }
