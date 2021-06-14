import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SalesIndividualRoutingModule} from './sales-individual-routing.module';
import {SharedModule} from '../../../shared/shared.module';
import {SalesIndividualComponent} from './sales-individual.component';

@NgModule({
  imports: [
    CommonModule,
    SalesIndividualRoutingModule,
    SharedModule
  ],
  declarations: [
    SalesIndividualComponent
  ]
})
export class SalesIndividualModule { }
