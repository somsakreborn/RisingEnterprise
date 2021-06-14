import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'รายการสั่งซื้อ', status: false}, children: [
      // {path: 'orders', loadChildren: './orders-product/orders-product.module#OrdersProductModule'},
      {path: 'orders-create', loadChildren: './orders-product-create/orders-product-create.module#OrdersProductCreateModule'},
      {path: 'orders-edit/name/:keyword', loadChildren: './orders-product-edit/orders-product-edit.module#OrdersProductEditModule'},
      {path: 'orders-edit/:id', loadChildren: './orders-product-edit/orders-product-edit.module#OrdersProductEditModule'},
      {path: 'orders-import-tracking', loadChildren: './orders-product-import-tracking/orders-product-import-tracking.module#OrdersProductImportTrackingModule'},
      {path: 'orders-import-tracking/:data', loadChildren: './orders-product-import-tracking/orders-product-import-tracking.module#OrdersProductImportTrackingModule'},
      {path: 'orders-check', loadChildren: './orders-product-check/orders-product-check.module#OrdersProductCheckModule'},
      {path: 'orders-check-tracking', loadChildren:
              './orders-product-check-tracking/orders-product-check-tracking.module#OrdersProductCheckTrackingModule'},
      // {path: '', redirectTo: 'orders', pathMatch: 'full'},
      {path: '', redirectTo: 'details', pathMatch: 'full'},
        { path: 'details', loadChildren: './orders-product/orders-product.module#OrdersProductModule', data: {name: 'details'}},
        { path: 'waitpacks', loadChildren: './orders-product/orders-product.module#OrdersProductModule', data: {name: 'waitpacks'}},
        { path: 'packs', loadChildren: './orders-product/orders-product.module#OrdersProductModule', data: {name: 'packs'}},
        { path: 'deliverys', loadChildren: './orders-product/orders-product.module#OrdersProductModule', data: {name: 'deliverys'}},
        { path: 'success', loadChildren: './orders-product/orders-product.module#OrdersProductModule', data: {name: 'success'}},
        { path: 'fails', loadChildren: './orders-product/orders-product.module#OrdersProductModule', data: {name: 'fails'}},
      // {path: '**', redirectTo: '/not-found', pathMatch: 'full'},
      {path: '', loadChildren: './orders-product/orders-product.module#OrdersProductModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
