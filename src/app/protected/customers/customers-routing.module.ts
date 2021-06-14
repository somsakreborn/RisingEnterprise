import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
      path: '', data: {title: 'ลูกค้า', status: false}, children: [
            {path: '', loadChildren: './customers-detail/customers-detail.module#CustomersDetailModule'},
            {path: 'customers-create', loadChildren: './customers-create/customers-create.module#CustomersCreateModule'},
            {path: 'customers-edit/:id', loadChildren: './customers-edit/customers-edit.module#CustomersEditModule'},
            {path: '', redirectTo: 'customers', pathMatch: 'full'},
            {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
