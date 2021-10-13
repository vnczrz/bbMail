import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from "rxjs";
import { map,  take } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    router: RouterStateSnapshot
    ): 
      Observable<boolean | UrlTree> |
      Promise<boolean | UrlTree> |
      boolean {
    //when guard is ran it calls auth service and calls subject asking for last value<user>
    return this.authService.user
        .pipe(
          take(1),
          map(user => {
            const isAuthenticated = !!user;

            if (isAuthenticated) {
              return true;
            }

            return this.router.createUrlTree(['/login'])
          })
        )
  }
}
