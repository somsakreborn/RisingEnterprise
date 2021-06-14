import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SalesExpanseComponent} from './sales-expanse.component';

const routes: Routes = [
  {
    path: '', component: SalesExpanseComponent, data: {
      title: 'Sales Expanse',
      icon: 'icon-layout-sidebar-left',
      caption: 'Sales Expanse',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesExpanseRoutingModule {
}
