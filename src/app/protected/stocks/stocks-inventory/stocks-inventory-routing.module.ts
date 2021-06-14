import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {StocksInventoryComponent} from './stocks-inventory.component';

const routes: Routes = [
    {
        path: '', component: StocksInventoryComponent, data: {
            title: 'สินค้าคงคลัง',
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
export class StocksInventoryRoutingModule { }
