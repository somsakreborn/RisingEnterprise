import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthenGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    try {
      const authenInfo = JSON.parse(localStorage.getItem(environment.localAuthenInfo));

      // console.log('show = ' + JSON.stringify(authenInfo));
      if (authenInfo.token !== '') {
        return true;
      }

    } catch (error) {

      // console.log('error');
      // console.log(error);

      this.router.navigate(['/auth/login']);
      return false;
    }

    // console.log('last');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
