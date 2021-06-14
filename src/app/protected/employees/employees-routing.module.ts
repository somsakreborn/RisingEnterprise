import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'พนักงาน', status: false}, children: [
      {path: '', loadChildren: './employees-detail/employees-detail.module#EmployeesDetailModule'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
