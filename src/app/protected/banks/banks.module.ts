import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BanksRoutingModule} from './banks-routing.module';
import {BankService} from './banks.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../../services/auth.interceptor';

@NgModule({
  imports: [
    CommonModule,
    BanksRoutingModule
  ],
  declarations: [],
  providers: [
      BankService,
      {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
      }]
})
export class BanksModule { }
