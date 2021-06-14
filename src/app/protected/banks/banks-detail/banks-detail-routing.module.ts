import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BanksDetailComponent} from './banks-detail.component';

const routes: Routes = [
  {
    path: '', component: BanksDetailComponent, data: {
      // title: 'Bank Detail',
      title: 'ข้อมูลธนาคาร',
      icon: 'icon-layout-sidebar-left',
      caption: 'Banks Detail',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BanksDetailRoutingModule { }
