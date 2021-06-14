import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsDetailRoutingModule} from './products-detail-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ProductsDetailComponent} from './products-detail.component';
import {ProductsService} from '../products.service';
import {DataFilterProductPipe} from '../_pipe/data-filter-product.pipe';
import {UiSwitchModule} from 'ng2-ui-switch';
import {ArchwizardModule} from 'ng2-archwizard/dist';

import {CurrencyMaskModule} from 'ng2-currency-mask';
import {TextMaskModule} from 'angular2-text-mask';

// Import ngx-barcode module
import {NgxBarcodeModule} from 'ngx-barcode';

@NgModule({
  imports: [
    CommonModule,
    ProductsDetailRoutingModule,
    UiSwitchModule,
    ArchwizardModule,
    CurrencyMaskModule,
    TextMaskModule,
    NgxBarcodeModule,
    SharedModule
  ],
  declarations: [
    ProductsDetailComponent,
    DataFilterProductPipe
  ],
    providers: [
        ProductsService,
    ]
})
export class ProductsDetailModule { }
