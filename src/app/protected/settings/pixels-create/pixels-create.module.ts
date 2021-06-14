import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../../shared/shared.module';
import {PixelsCreateRoutingModule} from './pixels-create-routing.module';
import {PixelsCreateComponent} from './pixels-create.component';

@NgModule({
  declarations: [PixelsCreateComponent],
  imports: [
    CommonModule,
    PixelsCreateRoutingModule,
    SharedModule
  ]
})
export class PixelsCreateModule { }
