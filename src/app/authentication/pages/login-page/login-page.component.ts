import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  //angular
  public error:any = '';

  disabled = ""
  active:any;
  constructor(private authservice: AuthService, private router: Router, private formBuilder : FormBuilder) { }

  loginForm = this.formBuilder.group({
    username : ['',[Validators.required, Validators.email]],
    password : ['', Validators.required]
  });

  errorMessage = ''; // validation _error handle

  ngOnInit(): void {

  }

  login(){
    this.disabled = "btn-loading"
    let user= this.loginForm.controls['username'].value
    let pass= this.loginForm.controls['password'].value
    console.log(this.loginForm.controls['username'].value)
    console.log(this.loginForm.controls['password'].value)
    this.router.navigate(['/almacen/dashboard'])
    if (this.validateForm(user, pass)) {
      this.router.navigate(['/almacen/dashboard'])
      this.errorMessage = "Success";
      console.clear()
    }
  }

  validateForm(email:any, password:any) {
    if (email.length === 0) {
      this.errorMessage = "please enter email id";
      return false;
    }

    if (password.length === 0) {
      this.errorMessage = "please enter password";
      return false;
    }

    if (password.length < 6) {
      this.errorMessage = "password should be at least 6 char";
      return false;
    }

    this.errorMessage = '';
    return true;

  }

  Submit(){
    this.disabled = "btn-loading"
    if (this.loginForm.controls['username'].value === "spruko@admin.com" && this.loginForm.controls['password'].value === "sprukoadmin" )
    {
      this.router.navigate(['/dashboard']);
    }
    else{
      this.error = "Please check email and passowrd"
    }
  }
}
