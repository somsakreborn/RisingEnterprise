import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersDetailRoutingModule} from './users-detail-routing.module';
import {UsersDetailComponent} from './users-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {DataTableModule} from 'angular2-datatable';
import {UsersService} from '../users.service';
import {DataFilterUserPipe} from '../_pipe/data-filter-user.pipe';

@NgModule({
  imports: [
    CommonModule,
    UsersDetailRoutingModule,
    SharedModule,
    DataTableModule
  ],
  declarations: [
      UsersDetailComponent,
      DataFilterUserPipe
  ],
    providers: [
      UsersService
    ]
})
export class UsersDetailModule { }
