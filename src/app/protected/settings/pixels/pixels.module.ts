import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PixelsRoutingModule} from './pixels-routing.module';
import {PixelsComponent} from './pixels.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [PixelsComponent],
  imports: [
    CommonModule,
    PixelsRoutingModule,
    SharedModule
  ]
})
export class PixelsModule { }
