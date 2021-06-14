import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EmployeesRoutingModule} from './employees-routing.module';
import {EmployeeService} from './employee.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';

@NgModule({
    imports: [
        CommonModule,
        EmployeesRoutingModule
    ],
    declarations: [],
    providers: [
        EmployeeService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }]
})
export class EmployeesModule {
}
