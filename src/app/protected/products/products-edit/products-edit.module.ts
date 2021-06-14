import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsEditRoutingModule} from './products-edit-routing.module';
import {ProductsEditComponent} from './products-edit.component';
import {SharedModule} from '../../../shared/shared.module';

import {SelectModule} from 'ng-select';
import {SelectOptionService} from '../../../shared/elements/select-option.service';
import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  imports: [
    CommonModule,
    ProductsEditRoutingModule,
    SharedModule,
    SelectModule,
    UiSwitchModule
  ],
  declarations: [ProductsEditComponent],
    providers: [SelectOptionService]
})
export class ProductsEditModule { }
