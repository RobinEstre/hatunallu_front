import { Component, OnInit, ViewChild,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import {AuthServiceService} from "../../services/auth-service.service";
import * as CryptoJS from 'crypto-js';
import {NotifierService} from "angular-notifier";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  @ViewChild('passwordEyeRegister') passwordEye:any;

  public loginForm: FormGroup;

  constructor(private authservice: AuthService, private router: Router, private formBuilder : FormBuilder,
              private loginService: AuthServiceService, private notifier: NotifierService ) {
    this.loginForm = this.formBuilder.group({
      username : ['',[Validators.required]],
      password : ['', Validators.required]
    });
  }

  public error:any = '';

  disabled = ""
  passwordTypeInput  =  'password';
  active:any;
  iconpassword  =  'eye';

  ngOnInit(): void {
    this.notifier.notify('success', '¡Logeado Coreectamente!');
  }


  login(){
    this.disabled = "btn-loading"
    let user= this.loginForm.controls['username'].value
    let pass= this.loginForm.controls['password'].value

    const body={
      "usuario": user,
      "password": pass
    }
    this.loginService.login(body).subscribe( resp => {
      if (resp.access) {
        console.log('123')

        console.log(resp['access'])
        localStorage.setItem('token', resp['access']);
        this.getConfig()
        this.notifier.notify('success', '¡Logeado Coreectamente!');
        this.router.navigate(['/panel'])
        console.clear()
      }
    }, error => {
      if (error.status === 401) {
        console.log('123')
        this.notifier.notify('error', '¡Nombre de usuario o contraseña incorrectos!');
      }
    })
  }

  getConfig(){
    this.loginService.listConfig().subscribe( data => {
      localStorage.setItem('config', data['jwt_body']);
    })
  }

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-slash' ? 'eye' : 'eye-slash';
    //this.passwordEye.el.setFocus()
  }

  CryptoJSAesEncrypt(passphrase, plaintext) {

    var salt = CryptoJS.lib.WordArray.random(256);
    var iv = CryptoJS.lib.WordArray.random(16);

    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999 });

    var encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv: iv});

    var data = {
      ciphertext : CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt : CryptoJS.enc.Hex.stringify(salt),
      iv : CryptoJS.enc.Hex.stringify(iv)
    };

    return JSON.stringify(data);
  }

  CryptoJSAesDecrypt(passphrase, encryptedJsonString) {
    var objJson = JSON.parse(encryptedJsonString);
    var encrypted = objJson.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(objJson.salt);
    var iv = CryptoJS.enc.Hex.parse(objJson.iv);
    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
