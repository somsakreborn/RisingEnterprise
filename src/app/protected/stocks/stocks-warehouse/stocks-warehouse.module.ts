import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StocksWarehouseRoutingModule} from './stocks-warehouse-routing.module';
import {StocksWarehouseComponent} from './stocks-warehouse.component';
import {SharedModule} from '../../../shared/shared.module';

import {WarehousesService} from '../warehouses.service';
import {DataFilterWarehousePipe} from '../_pipe/data-filter-warehouse.pipe';
import {DataTableModule} from 'angular2-datatable';
import {UiSwitchModule} from 'ng2-ui-switch';
import {ArchwizardModule} from 'ng2-archwizard/dist';
import {ProductsService} from '../../products/products.service';

@NgModule({
    imports: [
        CommonModule,
        StocksWarehouseRoutingModule,
        DataTableModule,
        UiSwitchModule,
        ArchwizardModule,
        SharedModule
    ],
    declarations: [
        StocksWarehouseComponent,
        DataFilterWarehousePipe
    ],
    providers: [
        WarehousesService,
        ProductsService,
    ]
})
export class StocksWarehouseModule {
}
