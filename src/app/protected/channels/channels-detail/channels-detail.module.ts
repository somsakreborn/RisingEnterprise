import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelsDetailRoutingModule} from './channels-detail-routing.module';
import {ChannelsDetailComponent} from './channels-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {ChannelsService} from '../channels.service';
import {DataFilterChannelPipe} from '../_pipe/data-filter-channel.pipe';
import {DataTableModule} from 'angular2-datatable';
import {UiSwitchModule} from 'ng2-ui-switch';
import {ArchwizardModule} from 'ng2-archwizard/dist';

@NgModule({
    imports: [
        CommonModule,
        ChannelsDetailRoutingModule,
        DataTableModule,
        ArchwizardModule,
        UiSwitchModule,
        SharedModule
    ],
    declarations: [
        ChannelsDetailComponent,
        DataFilterChannelPipe
    ],
    providers: [
        ChannelsService
    ]
})
export class ChannelsDetailModule {
}
