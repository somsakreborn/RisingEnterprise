import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsCreateRoutingModule} from './products-create-routing.module';
import {ProductsCreateComponent} from './products-create.component';
import {SharedModule} from '../../../shared/shared.module';

import {SelectModule} from 'ng-select';
import {SelectOptionService} from '../../../shared/elements/select-option.service';
import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  imports: [
    CommonModule,
    ProductsCreateRoutingModule,
    SharedModule,
    SelectModule,
    UiSwitchModule
  ],
  declarations: [ProductsCreateComponent]
})
export class ProductsCreateModule { }
