import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';
import {SharedModule} from '../../shared/shared.module';
import {ChannelsService} from '../channels/channels.service';
import {SettingsService} from './settings.service';

// import {DataTableModule} from 'angular2-datatable';


@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    // DataTableModule
  ],
    providers: [
        ChannelsService,
        SettingsService
    ]
})
export class SettingsModule { }
