import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductsCreateComponent} from '../products-create/products-create.component';

const routes: Routes = [
    {
        path: '', component: ProductsCreateComponent, data: {
            title: 'เพิ่มข้อมูลสินค้า',
            icon: 'icon-layout-sidebar-left',
            caption: 'เพิ่มข้อมูลสินค้า',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsCreateRoutingModule { }
