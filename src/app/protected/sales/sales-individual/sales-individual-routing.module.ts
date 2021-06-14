import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SalesIndividualComponent} from './sales-individual.component';

const routes: Routes = [
  {
    path: '', component: SalesIndividualComponent, data: {
      title: 'Sales Individual',
      icon: 'icon-layout-sidebar-left',
      caption: 'Sales Individual',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesIndividualRoutingModule {
}
