import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrdersProductEditComponent} from './orders-product-edit.component';

const routes: Routes = [
  {
    path: '', component: OrdersProductEditComponent, data: {
        title: 'แก้ไขข้อมูลคำสั่งซื้อ',
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
export class OrdersProductEditRoutingModule { }
