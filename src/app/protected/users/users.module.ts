import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UsersService} from './users.service';
import {UsersRoutingModule} from './users-routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule
  ],
  declarations: [],
    providers: [
        UsersService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class UsersModule { }
