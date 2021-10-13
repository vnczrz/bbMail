import { Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';


import { AuthenticationService, AuthResponseData } from '../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  isLoading = false;
  error: string = null;

  constructor( 
    private auth : AuthenticationService,
    private router : Router,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    this.credentials = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'avatar': new FormControl(null)
    })
  }

  showAlert() {

    this.alertController.create({
      header: 'Oops!',
      message: this.error,
      buttons: ['OK']
    }).then(res => {

      res.present();
      this.credentials.reset();
    });

  }

  onSubmit() {
    console.log(this.credentials);
    let authObsHandler: Observable<AuthResponseData>;

    authObsHandler = this.auth.login(
                        this.credentials.controls.email.value, 
                        this.credentials.controls.password.value);

    ///obs subscribe logic
    authObsHandler.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        //navigate to auth state homepage on success
        this.router.navigate(['/tabs']);
      },
      ///we subscribed to errorMessage being emitted as an observable from the auth service
      errorMessage => { 
        console.log(errorMessage)
        this.error = errorMessage
        this.showAlert();
        this.isLoading = false;
      }
  );       

  }

}

