import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BanksDetailRoutingModule} from './banks-detail-routing.module';
import {BanksDetailComponent} from './banks-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {DataFilterBankPipe} from '../_pipe/data-filter-bank.pipe';
import {DataTableModule} from 'angular2-datatable';
import {BankService} from '../banks.service';
// add mars text format //
import {TextMaskModule} from 'angular2-text-mask';
import {UiSwitchModule} from 'ng2-ui-switch';

@NgModule({
  imports: [
    CommonModule,
    BanksDetailRoutingModule,
    SharedModule,
    DataTableModule,
    TextMaskModule,
    UiSwitchModule
  ],
  declarations: [
    BanksDetailComponent,
    DataFilterBankPipe
  ],
  providers: [
    BankService
  ]
})
export class BanksDetailModule { }
