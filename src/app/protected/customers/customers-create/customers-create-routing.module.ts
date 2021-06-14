import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomersCreateComponent} from './customers-create.component';

const routes: Routes = [
  {
    path: '', component: CustomersCreateComponent, data: {
        title: 'เพิ่มข้อมูลลูกค้า',
        icon: 'icon-layout-sidebar-left',
        caption: 'เพิ่มข้อมูลลูกค้า',
        status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersCreateRoutingModule { }
