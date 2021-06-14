import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PixelsCreateComponent} from './pixels-create.component';

const routes: Routes = [
    {
        path: '', component: PixelsCreateComponent, data: {
            title: 'Pixel Create',
            icon: 'icon-layout-sidebar-left',
            caption: 'Pixel Create',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PixelsCreateRoutingModule { }
