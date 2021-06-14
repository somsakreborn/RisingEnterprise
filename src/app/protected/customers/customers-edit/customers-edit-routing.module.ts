import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomersEditComponent} from './customers-edit.component';

const routes: Routes = [
  {
    path: '', component: CustomersEditComponent, data: {
        title: 'แก้ไขข้อมูลลูกค้า',
        icon: 'icon-layout-sidebar-left',
        caption: 'แก้ไขข้อมูลลูกค้า',
        status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersEditRoutingModule { }
