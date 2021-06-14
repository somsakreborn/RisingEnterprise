import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BranchsDetailRoutingModule} from './branchs-detail-routing.module';
import {BranchsDetailComponent} from './branchs-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {DataTableModule} from 'angular2-datatable';
import {BranchService} from '../branchs.service';
import {DataFilterBranchPipe} from '../_pipe/data-filter-branch.pipe';

@NgModule({
    imports: [
        CommonModule,
        BranchsDetailRoutingModule,
        SharedModule,
        DataTableModule
    ],
    declarations: [
        BranchsDetailComponent,
        DataFilterBranchPipe
    ],
    providers: [BranchService]
})
export class BranchsDetailModule {
}
