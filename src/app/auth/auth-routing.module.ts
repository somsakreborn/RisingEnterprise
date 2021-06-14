import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '', data: {title: 'Authentication', status: false}, children: [
      {
        path: 'login', loadChildren: './login/login.module#LoginModule'
      },
      {
        path: 'forgot', loadChildren: './forgot/forgot.module#ForgotModule'
      },
      {
        path: 'lock-screen', loadChildren: './lock-screen/lock-screen.module#LockScreenModule'
      },
      {
        path: 'registration', loadChildren: './registration/registration.module#RegistrationModule'
      },
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
