import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
        path: '', data: {title: 'Pixels', status: true}, children: [
            {path: 'pixels', loadChildren: './pixels/pixels.module#PixelsModule'},
            {path: 'pixels-create', loadChildren: './pixels-create/pixels-create.module#PixelsCreateModule'},
            {path: 'pixels-edit/:id', loadChildren: './pixels-edit/pixels-edit.module#PixelsEditModule'},
            {path: '', redirectTo: 'pixels', pathMatch: 'full'},
            {path: '**', redirectTo: '/not-found', pathMatch: 'full'}
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
