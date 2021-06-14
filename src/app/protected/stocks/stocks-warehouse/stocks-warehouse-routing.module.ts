import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StocksWarehouseComponent} from './stocks-warehouse.component';

const routes: Routes = [
    {
        path: '', component: StocksWarehouseComponent, data: {
            title: 'คลังสินค้า',
            icon: 'icon-layout-sidebar-left',
            caption: 'คลังสินค้า',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StocksWarehouseRoutingModule { }
