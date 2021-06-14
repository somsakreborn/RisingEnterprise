import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductsEditComponent} from './products-edit.component';

const routes: Routes = [
    {
        path: '', component: ProductsEditComponent, data: {
            title: 'แก้ไขข้อมูลสินค้า',
            icon: 'icon-layout-sidebar-left',
            caption: 'แก้ไขข้อมูลสินค้า',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsEditRoutingModule { }
