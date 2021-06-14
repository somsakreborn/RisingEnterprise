import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

import {OrdersRoutingModule} from './orders-routing.module';
import {OrdersComponent} from './orders.component';
import {OrdersService} from '../orders/orders.service';
import {CustomersService} from '../customers/customers.service';
import {ChannelsService} from '../channels/channels.service';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';
@NgModule({
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ],
  declarations: [
      OrdersComponent
    ],
    providers: [
        OrdersService,
        CustomersService,
        ChannelsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class OrdersModule { }
