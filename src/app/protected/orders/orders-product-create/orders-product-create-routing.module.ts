import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrdersProductCreateComponent} from './orders-product-create.component';

const routes: Routes = [
    {
        path: '', component: OrdersProductCreateComponent, data: {
            title: 'จัดการคำสั่งซื้อใหม่',
            icon: 'icon-layout-sidebar-left',
            caption: 'เพิ่มคำสั่งซื้อใหม่',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersProductCreateRoutingModule { }
