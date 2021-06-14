import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EmployeesDetailRoutingModule} from './employees-detail-routing.module';
import {EmployeesDetailComponent} from './employees-detail.component';
import {SharedModule} from '../../../shared/shared.module';
import {DataTableModule} from 'angular2-datatable';
import {EmployeeService} from '../employee.service';
import {DataFilterEmpPipe} from '../_pipe/data-filter-emp.pipe';

@NgModule({
    imports: [
        CommonModule,
        EmployeesDetailRoutingModule,
        SharedModule,
        DataTableModule
    ],
    declarations: [
        EmployeesDetailComponent,
        DataFilterEmpPipe
    ],
    providers: [EmployeeService]
})
export class EmployeesDetailModule {
}
