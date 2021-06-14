import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VerifiedProductRoutingModule} from './verified-product-routing.module';
import {VerifiedProductComponent} from './verified-product.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    VerifiedProductRoutingModule,
    SharedModule
  ],
  declarations: [
    VerifiedProductComponent
  ]
})
export class VerifiedProductModule { }
