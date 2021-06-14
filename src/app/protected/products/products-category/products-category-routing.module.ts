import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProductsCategoryComponent} from './products-category.component';

const routes: Routes = [
  {
    path: '', component: ProductsCategoryComponent, data: {
      title: 'หมวดหมู่สินค้า',
      icon: 'icon-layout-sidebar-left',
      caption: 'หมวดหมู่สินค้า',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsCategoryRoutingModule { }
