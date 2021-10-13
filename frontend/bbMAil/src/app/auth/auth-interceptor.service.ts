import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "./authentication.service";

import { exhaustMap, take}  from "rxjs/operators"

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{
    ///intercept all outgoing req and attach token params if auth

    constructor(private auth: AuthenticationService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler){
        ///call on user subject to check authenticated... if authenticated aka user exists, interceptor attaches token to req params
        return this.auth.user
            .pipe(
                take(1),
                exhaustMap(user => {
                    if (!user) {
                        return next.handle(request);
                    }

                    const reqWToken = request.clone({
                        params: new HttpParams().set('auth', user.token)
                    });
                    return next.handle(reqWToken);
                })
            )

    }
}