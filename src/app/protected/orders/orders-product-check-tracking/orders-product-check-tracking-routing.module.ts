import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrdersProductCheckTrackingComponent} from './orders-product-check-tracking.component';

const routes: Routes = [
    {
        path: '', component: OrdersProductCheckTrackingComponent, data: {
            title: 'เช็ค Tracking Number ข้อมูลคำสั่งซื้อ',
            icon: 'icon-layout-sidebar-left',
            caption: 'เช็ค Tracking Number ข้อมูลคำสั่งซื้อ',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductCheckTrackingRoutingModule { }
