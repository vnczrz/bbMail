import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor( 
    private auth : AuthenticationService,
    ) { }

  ngOnInit() {
    this.credentials = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'avatar': new FormControl(null)
    })
  }

  onSubmit() {
    console.log(this.credentials.value)
    this.auth.login(this.credentials.value)
  }

}

