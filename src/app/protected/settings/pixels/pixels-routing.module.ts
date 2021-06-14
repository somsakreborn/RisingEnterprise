import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {PixelsComponent} from './pixels.component';

const routes: Routes = [
    {
        path: '', component: PixelsComponent, data: {
            title: 'Pixel Setting',
            icon: 'icon-layout-sidebar-left',
            caption: 'Pixel Setting',
            status: true
        }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PixelsRoutingModule { }
