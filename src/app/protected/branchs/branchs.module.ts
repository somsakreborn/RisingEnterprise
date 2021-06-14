import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BranchsRoutingModule} from './branchs-routing.module';
import {BranchService} from './branchs.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';

@NgModule({
    imports: [
        CommonModule,
        BranchsRoutingModule
    ],
    declarations: [
    ],
    providers: [
        BranchService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }]
})
export class BranchsModule {
}
