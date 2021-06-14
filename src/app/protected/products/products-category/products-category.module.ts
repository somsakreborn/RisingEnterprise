import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsCategoryRoutingModule} from './products-category-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {ProductsCategoryComponent} from './products-category.component';
import {DataTableModule} from 'angular2-datatable';
import {DataFilterCategoryPipe} from '../_pipe/data-filter-category.pipe';
import {UiSwitchModule} from 'ng2-ui-switch';


@NgModule({
  imports: [
    CommonModule,
    ProductsCategoryRoutingModule,
    DataTableModule,
    UiSwitchModule,
    SharedModule
  ],
  declarations: [
    ProductsCategoryComponent,
    DataFilterCategoryPipe
  ],
  providers: [
  ]
})
export class ProductsCategoryModule { }
