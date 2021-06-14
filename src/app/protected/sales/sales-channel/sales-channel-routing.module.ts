import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SalesChannelComponent} from './sales-channel.component';

const routes: Routes = [
  {
    path: '', component: SalesChannelComponent, data: {
      title: 'Sales Channel',
      icon: 'icon-layout-sidebar-left',
      caption: 'Sales Channel',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesChannelRoutingModule { }
