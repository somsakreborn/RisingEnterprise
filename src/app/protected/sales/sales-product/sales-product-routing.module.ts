import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {SalesProductComponent} from './sales-product.component';

const routes: Routes = [
  {
    path: '', component: SalesProductComponent, data: {
      title: 'Sales Product',
      icon: 'icon-layout-sidebar-left',
      caption: 'Sales Product',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesProductRoutingModule { }
