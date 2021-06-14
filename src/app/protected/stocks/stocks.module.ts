import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StocksRoutingModule} from './stocks-routing.module';
import {StocksComponent} from './stocks.component';
import {SharedModule} from '../../shared/shared.module';

// import {CategoryService} from '../category.service';
// import {CounterService} from '../counter.service';
import {InventoryService} from './inventory.service';
import {WarehousesService} from './warehouses.service';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';
import {CategoryService} from '../products/category.service';
import {CounterService} from '../products/counter.service';
import {ProductsService} from '../products/products.service';


@NgModule({
  imports: [
    CommonModule,
    StocksRoutingModule,
    SharedModule
  ],
  declarations: [StocksComponent],
    providers: [
        WarehousesService,
        InventoryService,
        ProductsService,
        CategoryService,
        CounterService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class StocksModule { }
