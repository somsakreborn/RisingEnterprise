import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrdersProductComponent} from './orders-product.component';

const routes: Routes = [
    {
        path: '', component: OrdersProductComponent, data: {
            title: 'รายการสั่งซื้อทั้งหมด',
            icon: 'icon-layout-sidebar-left',
            caption: 'รายการสั่งซื้อ',
            status: true
        }
    }
    // ,
    // { path: '', component: OrdersProductComponent, data: {name: 'details'}},
    // { path: 'waitpacks', component: OrdersProductComponent, data: {name: 'orderswaitpacks'}},
    // { path: 'packs', component: OrdersProductComponent, data: {name: 'orderspacks'}},
    // { path: 'deliverys', component: OrdersProductComponent, data: {name: 'ordersdeliverys'}}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductRoutingModule { }
