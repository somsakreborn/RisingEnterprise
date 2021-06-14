import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShipmentsDetailComponent} from './shipments-detail.component';

const routes: Routes = [
  {
    path: '', component: ShipmentsDetailComponent, data: {
      // title: 'Shipments Detail',
      title: 'รายละเอียดวิธีจัดส่ง',
      icon: 'icon-layout-sidebar-left',
      caption: 'Shipments Detail',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentsDetailRoutingModule { }
