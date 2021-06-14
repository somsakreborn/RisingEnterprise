import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersEditRoutingModule} from './customers-edit-routing.module';
import {CustomersEditComponent} from './customers-edit.component';
import {SharedModule} from '../../../shared/shared.module';

import {SelectModule} from 'ng-select';
import {SelectOptionService} from '../../../shared/elements/select-option.service';
import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  imports: [
    CommonModule,
    CustomersEditRoutingModule,
    SelectModule,
    UiSwitchModule,
    SharedModule
  ],
  declarations: [CustomersEditComponent],
      providers: [SelectOptionService]
})
export class CustomersEditModule { }
