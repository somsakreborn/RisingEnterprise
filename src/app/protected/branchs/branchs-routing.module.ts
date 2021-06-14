import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'สาขา', status: false}, children: [
      {path: '', loadChildren: './branchs-detail/branchs-detail.module#BranchsDetailModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchsRoutingModule { }
