import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UsersDetailComponent} from './users-detail.component';

const routes: Routes = [
    {
        path: '', component: UsersDetailComponent, data: {
            // title: 'Users Detail',
            title: 'รายละเอียดผู้ใช้งานระบบ',
            icon: 'icon-layout-sidebar-left',
            caption: 'Users Detail',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersDetailRoutingModule { }
