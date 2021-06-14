import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '', data: {title: 'จัดการสิทธิ์ผู้ใช้งาน', status: false}, children: [
            {path: '', loadChildren: './users-detail/users-detail.module#UsersDetailModule'}
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
