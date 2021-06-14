import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VerifiedProductComponent} from './verified-product.component';

const routes: Routes = [
  {
    path: '', component: VerifiedProductComponent, data: {
      title: 'Verified Product',
      icon: 'icon-layout-sidebar-left',
      caption: 'Verified Product',
      status: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifiedProductRoutingModule { }
