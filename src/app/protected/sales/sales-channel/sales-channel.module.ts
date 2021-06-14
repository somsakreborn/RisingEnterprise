import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesChannelRoutingModule} from './sales-channel-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {SalesChannelComponent} from './sales-channel.component';

@NgModule({
  imports: [
    CommonModule,
    SalesChannelRoutingModule,
    SharedModule
  ],
  declarations: [
    SalesChannelComponent
  ]
})
export class SalesChannelModule { }
