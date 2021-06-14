import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'Verified', status: false}, children: [
      {path: '', loadChildren: './verified-product/verified-product.module#VerifiedProductModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifiedRoutingModule { }
