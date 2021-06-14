import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CustomersDetailComponent} from './customers-detail.component';

const routes: Routes = [
  {
    path: '', component: CustomersDetailComponent, data: {
        title: 'ข้อมูลลูกค้า',
        icon: 'icon-layout-sidebar-left',
        caption: 'ลูกค้า',
        status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersDetailRoutingModule { }
