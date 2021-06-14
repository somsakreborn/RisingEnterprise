import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrdersProductCheckComponent} from '../orders-product-check/orders-product-check.component';

const routes: Routes = [
    {
        path: '', component: OrdersProductCheckComponent, data: {
            title: 'คอนเฟิร์มข้อมูลคำสั่งซื้อ',
            icon: 'icon-layout-sidebar-left',
            caption: 'คอนเฟิร์มข้อมูลคำสั่งซื้อ',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductCheckRoutingModule { }
