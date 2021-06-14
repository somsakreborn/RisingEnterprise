import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EmployeesDetailComponent} from './employees-detail.component';

const routes: Routes = [
  {
    path: '', component: EmployeesDetailComponent, data: {
      // title: 'Employees Detail',
      title: 'ข้อมูลพนักงาน',
      icon: 'icon-layout-sidebar-left',
      caption: 'Employees Detail',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesDetailRoutingModule { }
