import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // console.log('-- intercept --');
        const authInfo2 = JSON.parse(localStorage.getItem(environment.localAuthenInfo));
        if (authInfo2 != null) {
            const cloned = req.clone({headers: req.headers.set('x-access-token', authInfo2.token)});
            // const cloned = req.clone({ headers: req.headers.set('x-access-token', "123") });

            // simple way
            // return next.handle(cloned);
            // Intercept response too
            return next.handle(cloned).do((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 403 || err.status === 500) {
                        // redirect to the login route
                        // or show a modal
                        // alert("Token is not valid");
                        localStorage.setItem(environment.localAuthenInfo, null);
                        this.router.navigate(['/auth/login']);
                    }
                }
            });

        } else {
            return next.handle(req);
        }
    }
}
