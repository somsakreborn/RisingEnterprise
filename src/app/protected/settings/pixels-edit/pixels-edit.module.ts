import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PixelsEditRoutingModule} from './pixels-edit-routing.module';
import {PixelsEditComponent} from './pixels-edit.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [PixelsEditComponent],
  imports: [
    CommonModule,
    PixelsEditRoutingModule,
    SharedModule
  ]
})
export class PixelsEditModule { }
