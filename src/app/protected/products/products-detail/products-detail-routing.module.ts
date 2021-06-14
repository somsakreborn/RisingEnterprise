import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductsDetailComponent} from './products-detail.component';

const routes: Routes = [
  {
    path: '', component: ProductsDetailComponent, data: {
      title: 'รายการสินค้า',
      icon: 'icon-layout-sidebar-left',
      caption: 'รายการสินค้า',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsDetailRoutingModule { }
