import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'วิธีจัดส่ง', status: false}, children: [
      {path: '', loadChildren: './shipments-detail/shipments-detail.module#ShipmentsDetailModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentsRoutingModule { }
