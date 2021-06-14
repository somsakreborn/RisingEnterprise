import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'Sales', status: false}, children: [
      {path: 'expanse', loadChildren: './sales-expanse/sales-expanse.module#SalesExpanseModule'},
      {path: 'individual', loadChildren: './sales-individual/sales-individual.module#SalesIndividualModule'},
      {path: 'channel', loadChildren: './sales-channel/sales-channel.module#SalesChannelModule'},
      {path: 'product', loadChildren: './sales-product/sales-product.module#SalesProductModule'},
      {path: '', redirectTo: 'expanse', pathMatch: 'full'},
      {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule {
}
