import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }
  
  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    //when guard is ran it calls auth service and checks whether user is authenticated returning an observable<boolean>
    return this.authService.isAuthenticated().
      then((authenticated: boolean)=> {
        if ( authenticated ) {
         return true;
        } else { this.router.navigate(['/'])}
      }) 
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
   return this.canActivate(); 
  }
}
