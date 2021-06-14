import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'สินค้า', status: false}, children: [
      {path: 'product', loadChildren: './products-detail/products-detail.module#ProductsDetailModule'},
      {path: 'products-create', loadChildren: './products-create/products-create.module#ProductsCreateModule'},
      {path: 'products-edit/:id', loadChildren: './products-edit/products-edit.module#ProductsEditModule'},
      {path: 'category', loadChildren: './products-category/products-category.module#ProductsCategoryModule'},
      {path: '', redirectTo: 'product', pathMatch: 'full'},
      {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
