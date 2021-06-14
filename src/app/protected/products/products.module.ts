import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsRoutingModule} from './products-routing.module';
import {ProductsComponent} from './products.component';
import {SharedModule} from '../../shared/shared.module';

import {ProductsService} from './products.service';
import {CategoryService} from './category.service';
import {CounterService} from './counter.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';
import {WarehousesService} from '../stocks/warehouses.service';
import {InventoryService} from '../stocks/inventory.service';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ],
  declarations: [ProductsComponent],
    providers: [
        CategoryService,
        CounterService,
        ProductsService,
        WarehousesService,
        InventoryService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class ProductsModule { }
