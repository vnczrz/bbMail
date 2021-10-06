import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  isLoggedIn = true;
  
  userList = [
        {
          "email": "jreddie0@amazon.co.jp",
          "password": "vbvFNq",
          "avatar": "https://robohash.org/suscipitvoluptasnecessitatibus.png?size=50x50&set=set1"
        },
        {
          "email": "mgalbraeth1@usnews.com",
          "password": "b0gfWQnGBw",
          "avatar": "https://robohash.org/teneturatquenumquam.png?size=50x50&set=set1"
        },
        {
          "email": "gstannis2@ezinearticles.com",
          "password": "IrJB7AvyML79",
          "avatar": "https://robohash.org/illoremet.png?size=50x50&set=set1"
        },
        {
          "email": "grandales3@seattletimes.com",
          "password": "Sj8cSU9DnQ",
          "avatar": "https://robohash.org/autnonest.png?size=50x50&set=set1"
        },
        {
          "email": "jastlett4@nature.com",
          "password": "vabIJJqTE6P",
          "avatar": "https://robohash.org/consectetureligendiquo.png?size=50x50&set=set1"
        },
        {
          "email": "ablazewicz5@un.org",
          "password": "J8f21IV",
          "avatar": "https://robohash.org/deserunteosatque.png?size=50x50&set=set1"
        },
        {
          "email": "ibigland6@wunderground.com",
          "password": "9S8p1fPtCueY",
          "avatar": "https://robohash.org/eadolorumvelit.png?size=50x50&set=set1"
        },
        {
          "email": "lamorts7@de.vu",
          "password": "cPCeMCD3r",
          "avatar": "https://robohash.org/voluptatemculpaeaque.png?size=50x50&set=set1"
        },
        {
          "email": "goborne8@themeforest.net",
          "password": "3KcJRc0Rx2",
          "avatar": "https://robohash.org/laborumrationeut.png?size=50x50&set=set1"
        },
        {
          "email": "test@test.com",
          "password": "password",
          "avatar": "https://robohash.org/eligendiexpeditaalias.png?size=50x50&set=set1"
        }
     ]

  constructor( private router: Router) { }

  //find user with email in userList
  findEmail(email: string): any{
     const credential = this.userList.find(
       (s) => {
         return s.email === email;
       }
     );
     return credential;
   }

  login(user: User) {
    let check = this.findEmail(user.email);
    console.log(check)
    if (check.password === user.password) {
      this.isLoggedIn = true;
      this.router.navigate(['tabs']);
    }
  }

  //method resolves and returns promise 
  isAuthenticated(){
    //return promise
    const promise = new Promise(
          (resolve, reject) =>  {
            setTimeout(() => {
              resolve(this.isLoggedIn)
            }, 800)
          })
    return promise;
  }; 

}


