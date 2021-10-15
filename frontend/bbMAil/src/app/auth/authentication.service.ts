import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { User } from '../shared/user.model';

///firebase authresponse
export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean; //? means its optional field
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  //store user in behavior subject so can be casted to all interested components
  user = new BehaviorSubject<User>(null);

  private tokenExpirationTimer: any;
  
  constructor(
    private router: Router,
    private http: HttpClient  ) { }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOAl1DfW5noQdAG4Sqw36kOBnKRkpddL4',
      {
        email: email,
        password: password,
        returnSecureToken: true        
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => {
        this.handleAuth(
          resData.email,
          resData.localId,
          resData.idToken, 
          +resData.expiresIn
        )
      })
    )
  }

  login(email: string, password: string) {
    ///return prepared obs... pass to interceptor then pass to handleAuth()
    return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOAl1DfW5noQdAG4Sqw36kOBnKRkpddL4',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      //catch error and pass to handleError()
      catchError(this.handleError),
      ///tap and build user obj with handleAuth()
      tap(resData => {
        this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
        )
      })
    )
  }

  logout() {
    console.log('logged out');
    this.user.next(null);
    this.router.navigate(['/auth']);

    localStorage.removeItem('userData');

    //clear timer when we logout
    if(this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = null;

}

  autoLogin() {
    const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        return;
    }

    //create loaded user
    const loadedUser = new User(
                        userData.email,
                        userData.id,
                        userData._token,
                        new Date(userData._tokenExpirationDate)
                    );

    ///check for token & emit as current user
    if(loadedUser.token) {
        this.user.next(loadedUser);
        //set session timeout
        const expirationDuration = 
            new Date(userData._tokenExpirationDate).getTime()
            - new Date().getTime();
        
        this.autoLogout(expirationDuration);
    }

}

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
    }, expirationDuration);
  }

  ///AuthHandler 
  private handleAuth(email: string, userID: string, token: string, expiresIn: number){
    ///wrapping it in date will turn it into date object
    const expirationIn = new Date(
          new Date().getTime() + expiresIn * 1000
    ); //get timestamp in MS and add firebaseexpiratito see when it will expire from the current date  
    
    //init user obj with resData
    const user = new User(
      email,
      userID,
      token,
      expirationIn)
    
    //cast user onto behavior subj
    this.user.next(user);

    ///store tokenkey
    localStorage.setItem('userData', JSON.stringify(user));
  }

  ///Auth ErrorHandler
  private handleError(errorRes: HttpErrorResponse) {
    ///dive in to errors check it and return error obs
    let errorMessage = 'An Unknown Error Occured' /// default case if we cannot identify error
    //check if error has error message and then nested error field so switch case doesnt break
    if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage); //wrap errormessage in observablewith throw error
    } 
        switch ( errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email already exists!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email is not found';
                break;
            case 'INVALID_PASSWORD':
                errorMessage= ' This password is invalid';
                break;
        } 
        return throwError(errorMessage);
    }

}


  







// //find user with email in userList
  // findEmail(email: string): any{
  //   const credential = this.userList.find(
  //     (s) => {
  //       return s.email === email;
  //     }
  //   );
  //   return credential;
  // }

    // userList = [
  //       {
  //         "email": "jreddie0@amazon.co.jp",
  //         "password": "vbvFNq",
  //         "avatar": "https://robohash.org/suscipitvoluptasnecessitatibus.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "mgalbraeth1@usnews.com",
  //         "password": "b0gfWQnGBw",
  //         "avatar": "https://robohash.org/teneturatquenumquam.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "gstannis2@ezinearticles.com",
  //         "password": "IrJB7AvyML79",
  //         "avatar": "https://robohash.org/illoremet.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "grandales3@seattletimes.com",
  //         "password": "Sj8cSU9DnQ",
  //         "avatar": "https://robohash.org/autnonest.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "jastlett4@nature.com",
  //         "password": "vabIJJqTE6P",
  //         "avatar": "https://robohash.org/consectetureligendiquo.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "ablazewicz5@un.org",
  //         "password": "J8f21IV",
  //         "avatar": "https://robohash.org/deserunteosatque.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "ibigland6@wunderground.com",
  //         "password": "9S8p1fPtCueY",
  //         "avatar": "https://robohash.org/eadolorumvelit.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "lamorts7@de.vu",
  //         "password": "cPCeMCD3r",
  //         "avatar": "https://robohash.org/voluptatemculpaeaque.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "goborne8@themeforest.net",
  //         "password": "3KcJRc0Rx2",
  //         "avatar": "https://robohash.org/laborumrationeut.png?size=50x50&set=set1"
  //       },
  //       {
  //         "email": "test@test.com",
  //         "password": "password",
  //         "avatar": "https://robohash.org/eligendiexpeditaalias.png?size=50x50&set=set1"
  //       }
  //    ]

