import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '', data: {title: 'ช่องทาง', status: false}, children: [
            {path: 'channel', loadChildren: './channels-detail/channels-detail.module#ChannelsDetailModule'},
            {path: '', redirectTo: 'channel', pathMatch: 'full'},
            {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelsRoutingModule {
}
