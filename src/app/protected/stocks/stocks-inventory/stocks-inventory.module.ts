import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StocksInventoryRoutingModule} from './stocks-inventory-routing.module';
import {StocksInventoryComponent} from './stocks-inventory.component';
import {SharedModule} from '../../../shared/shared.module';

import {InventoryService} from '../inventory.service';
import {DataFilterInventoryPipe} from '../_pipe/data-filter-inventory.pipe';

import {DataTableModule} from 'angular2-datatable';
import {UiSwitchModule} from 'ng2-ui-switch';
import {ArchwizardModule} from 'ng2-archwizard/dist';
import {ProductsService} from '../../products/products.service';
import {WarehousesService} from '../warehouses.service';

// import {DataFilterProductPipe} from '../../products/_pipe/data-filter-product.pipe';

@NgModule({
    imports: [
        CommonModule,
        StocksInventoryRoutingModule,
        DataTableModule,
        UiSwitchModule,
        ArchwizardModule,
        SharedModule
    ],
    declarations: [
        StocksInventoryComponent,
        DataFilterInventoryPipe
    ],
    providers: [
        InventoryService,
        ProductsService,
        WarehousesService
    ]
})
export class StocksInventoryModule { }
