import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PixelsEditComponent} from '../pixels-edit/pixels-edit.component';

const routes: Routes = [
    {
        path: '', component: PixelsEditComponent, data: {
            title: 'Pixel Edit',
            icon: 'icon-layout-sidebar-left',
            caption: 'Pixel Edit',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PixelsEditRoutingModule { }
