import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BranchsDetailComponent} from './branchs-detail.component';

const routes: Routes = [
  {
    path: '', component: BranchsDetailComponent, data: {
      // title: 'Branchs Detail',
      title: 'ข้อมูลสาขา',
      icon: 'icon-layout-sidebar-left',
      caption: 'Branches Detail',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchsDetailRoutingModule { }
