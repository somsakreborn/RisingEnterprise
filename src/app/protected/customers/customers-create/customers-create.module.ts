import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CustomersCreateRoutingModule} from './customers-create-routing.module';
import {CustomersCreateComponent} from './customers-create.component';
import {SharedModule} from '../../../shared/shared.module';

import {SelectModule} from 'ng-select';
import {SelectOptionService} from '../../../shared/elements/select-option.service';
import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  imports: [
    CommonModule,
    CustomersCreateRoutingModule,
    UiSwitchModule,
    SharedModule,
    SelectModule
  ],
  declarations: [CustomersCreateComponent],
    providers: [SelectOptionService]
})
export class CustomersCreateModule { }
