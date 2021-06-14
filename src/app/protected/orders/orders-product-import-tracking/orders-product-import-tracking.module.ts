import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OrdersProductImportTrackingRoutingModule} from './orders-product-import-tracking-routing.module';
import {OrdersProductImportTrackingComponent} from './orders-product-import-tracking.component';
// Import ngx-barcode module
import {NgxBarcodeModule} from 'ngx-barcode';
import {SharedModule} from '../../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    OrdersProductImportTrackingRoutingModule,
    NgxBarcodeModule,
    SharedModule
  ],
  declarations: [OrdersProductImportTrackingComponent]
})
export class OrdersProductImportTrackingModule { }
