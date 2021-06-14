import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShipmentsDetailRoutingModule} from './shipments-detail-routing.module';
import {ShipmentsDetailComponent} from './shipments-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {DataTableModule} from 'angular2-datatable';
import {ShipmentService} from '../shipments.service';
import {DataFilterShipmentPipe} from '../_pipe/data-filter-shipment.pipe';
import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  imports: [
    CommonModule,
    ShipmentsDetailRoutingModule,
    SharedModule,
    DataTableModule,
    UiSwitchModule
  ],
  declarations: [
    ShipmentsDetailComponent,
    DataFilterShipmentPipe
  ],
    providers: [
        ShipmentService
    ]
})
export class ShipmentsDetailModule { }
