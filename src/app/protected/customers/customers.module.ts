import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersRoutingModule} from './customers-routing.module';
import {CustomersComponent} from './customers.component';
import {SharedModule} from '../../shared/shared.module';
import {CustomersService} from './customers.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';

import {ChannelsService} from '../channels/channels.service';
import {CounterService} from '../products/counter.service';

@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ],
  declarations: [CustomersComponent],
  providers: [
    CustomersService,
    ChannelsService,
    CounterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CustomersModule { }
