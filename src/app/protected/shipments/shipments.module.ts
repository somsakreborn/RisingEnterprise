import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShipmentsRoutingModule} from './shipments-routing.module';
// import {ShipmentService} from './shipments.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';

@NgModule({
  imports: [
    CommonModule,
    ShipmentsRoutingModule
  ],
  declarations: [],
    providers: [
        // ShipmentService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class ShipmentsModule { }
