import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlertController } from '@ionic/angular';



import { AuthenticationService, AuthResponseData } from '../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  isRegisterMode = false;
  isLoading = false;
  error: string = null;

  constructor( 
    private auth : AuthenticationService,
    private router : Router,
    private alertController: AlertController
    ) { }

  ngOnInit() {
    //console.log(this.isRegisterMode)
    this.credentials = new FormGroup(
      {
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'password': new FormControl(
          null,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ],
        ),
        'confirmPassword': new FormControl(null, Validators.required)
      }
    );

    this.credentials.valueChanges
      .subscribe(cred => {
        const password = cred.password;
        const confirm = cred.confirmPassword;
        if (password !== confirm) {
          this.credentials.get('confirmPassword').setErrors({noMatch: true});
        } else {
          this.credentials.get('confirmPassword').setErrors(null);
        }
        
      })


  }

  onRegisterMode() {
    this.isRegisterMode = !this.isRegisterMode;
  }

  onSubmit() {
    console.log(this.credentials);
    let authObsHandler: Observable<AuthResponseData>;

    if (this.isRegisterMode){
      authObsHandler = this.auth.signUp(
        this.credentials.controls.email.value, 
        this.credentials.controls.password.value);
    } else {
      authObsHandler = this.auth.login(
        this.credentials.controls.email.value, 
        this.credentials.controls.password.value);
    }

    ///obs subscribe logic
    authObsHandler.subscribe(
      resData => {
        
        console.log(resData);
        
        if (this.isRegisterMode){
          this.isLoading = false;
          this.isRegisterMode = false;

          this.alertController.create({
            header: 'Success!',
            message: "You're a bird now!",
            buttons: ['Go back to Login']
          }).then(res => {
            res.present();
            this.credentials.reset();
          })
        }
        else {
          //navigate to auth state homepage on success
          this.router.navigate(['/tabs']);
        }

      },
      ///we subscribed to errorMessage being emitted as an observable from the auth service
      errorMessage => { 
        console.log(errorMessage)
        this.error = errorMessage
        this.showErrorAlert();
        this.isLoading = false;
      }
    );       
  }

  showErrorAlert() {
    this.alertController.create({
      header: 'Oops!',
      message: this.error,
      buttons: ['OK']
    }).then(res => {

      res.present();
      this.credentials.reset();
    });

}

}

