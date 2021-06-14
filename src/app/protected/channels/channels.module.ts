import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelsRoutingModule} from './channels-routing.module';
import {ChannelsComponent} from './channels.component';
import {SharedModule} from '../../shared/shared.module';
import {ChannelsService} from './channels.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';
import {WarehousesService} from '../stocks/warehouses.service';

@NgModule({
    imports: [
        CommonModule,
        ChannelsRoutingModule,
        SharedModule
    ],
    declarations: [
        ChannelsComponent
    ],
    providers: [
        ChannelsService,
        WarehousesService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class ChannelsModule {
}
