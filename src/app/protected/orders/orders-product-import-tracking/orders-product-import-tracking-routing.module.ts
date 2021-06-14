import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrdersProductImportTrackingComponent} from './orders-product-import-tracking.component';

const routes: Routes = [
    {
        path: '', component: OrdersProductImportTrackingComponent, data: {
            title: 'พิมพ์ข้อมูลคำสั่งซื้อ',
            icon: 'icon-layout-sidebar-left',
            caption: 'ข้อมูลคำสั่งซื้อ',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductImportTrackingRoutingModule { }
