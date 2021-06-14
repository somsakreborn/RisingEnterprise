import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesProductRoutingModule} from './sales-product-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {SalesProductComponent} from './sales-product.component';
// import {ReportsService} from '../sales.service';
// import {ProductsService} from '../../products/products.service';

@NgModule({
  imports: [
    CommonModule,
    SalesProductRoutingModule,
    SharedModule
  ],
  declarations: [
    SalesProductComponent
  ]
    // ,
    // providers: [
    //     ReportsService,
    //     ProductsService
    // ]
})
export class SalesProductModule { }
