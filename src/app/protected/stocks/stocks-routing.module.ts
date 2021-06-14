import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '', data: {title: 'สต๊อกสินค้า', status: false}, children: [
            {path: 'inventory', loadChildren: './stocks-inventory/stocks-inventory.module#StocksInventoryModule'},
            {path: 'warehouse', loadChildren: './stocks-warehouse/stocks-warehouse.module#StocksWarehouseModule'},
            {path: '', redirectTo: 'warehouse', pathMatch: 'full'},
            {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksRoutingModule { }
