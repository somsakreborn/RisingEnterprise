import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {OrderforcustomerComponent} from './supports/orderforcustomer/orderforcustomer.component';
import {AuthenGuard} from './services/authen.guard';

const routes: Routes = [
  {path: 'not-found', component: PageNotFoundComponent},
  {path: 'supports/customers/:ODId', component: OrderforcustomerComponent},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path: 'management', loadChildren: './protected/protected.module#ProtectedModule', canActivate: [AuthenGuard]},
  {path: '', redirectTo: 'auth', pathMatch: 'full'},
  {path: '**', redirectTo: 'not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
