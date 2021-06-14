import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';

import {OrdersProductCheckTrackingRoutingModule} from './orders-product-check-tracking-routing.module';
import {OrdersProductCheckTrackingComponent} from './orders-product-check-tracking.component';
// import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  declarations: [OrdersProductCheckTrackingComponent],
  imports: [
    CommonModule,
    SharedModule,
    OrdersProductCheckTrackingRoutingModule,
    // UiSwitchModule
  ]
})
export class OrdersProductCheckTrackingModule { }
