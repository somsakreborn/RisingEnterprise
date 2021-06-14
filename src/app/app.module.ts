import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from './shared/shared.module';
import {MenuItems} from './shared/menu-items/menu-items';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

import {AuthComponent} from './auth/auth.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppserverService} from './services/appserver.service';
import {AuthInterceptor} from './services/auth.interceptor';
import {OrderforcustomerComponent} from './supports/orderforcustomer/orderforcustomer.component';

// import {AuthenGuard} from './services/authen.guard';

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        AuthComponent,
        OrderforcustomerComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule
    ],
    schemas: [],
    providers: [
        MenuItems,
        AppserverService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
