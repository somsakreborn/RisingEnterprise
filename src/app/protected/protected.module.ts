import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProtectedRoutingModule} from './protected-routing.module';
import {ProtectedComponent} from './protected.component';
import {BreadcrumbsComponent} from './layouts/breadcrumbs/breadcrumbs.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProtectedRoutingModule,
    SharedModule
  ],
  declarations: [
    ProtectedComponent,
    BreadcrumbsComponent
  ]
})
export class ProtectedModule {
}
