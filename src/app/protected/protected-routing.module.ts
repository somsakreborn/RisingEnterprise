import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProtectedComponent} from './protected.component';

const routes: Routes = [
  {
    path: '', component: ProtectedComponent, children: [
      {path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
      {path: 'users', loadChildren: './users/users.module#UsersModule'},
      {path: 'sales', loadChildren: './sales/sales.module#SalesModule'},
      {path: 'orders', loadChildren: './orders/orders.module#OrdersModule'},
      {path: 'manageorders', loadChildren: './orders/orders.module#OrdersModule'}, // 'split-orders' for sub-menu //
      {path: 'customers', loadChildren: './customers/customers.module#CustomersModule'},
      {path: 'products', loadChildren: './products/products.module#ProductsModule'},
      {path: 'stocks', loadChildren: './stocks/stocks.module#StocksModule'},
      {path: 'channels', loadChildren: './channels/channels.module#ChannelsModule'},
      {path: 'verified', loadChildren: './verified/verified.module#VerifiedModule'},
      {path: 'employees', loadChildren: './employees/employees.module#EmployeesModule'},
      {path: 'branchs', loadChildren: './branchs/branchs.module#BranchsModule'},
      {path: 'banks', loadChildren: './banks/banks.module#BanksModule'},
      {path: 'shipments', loadChildren: './shipments/shipments.module#ShipmentsModule'},
      {path: 'settings', loadChildren: './settings/settings.module#SettingsModule'},
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule {
}
