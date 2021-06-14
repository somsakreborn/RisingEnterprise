import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ChannelsDetailComponent} from './channels-detail.component';

const routes: Routes = [
    {
        path: '', component: ChannelsDetailComponent, data: {
            title: 'ช่องทางการขาย',
            icon: 'icon-layout-sidebar-left',
            caption: 'ช่องทางการขาย',
            status: true
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelsDetailRoutingModule { }
