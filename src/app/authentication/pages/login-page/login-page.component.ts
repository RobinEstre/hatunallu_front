import { Component, OnInit, ViewChild,  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import {AuthServiceService} from "../../services/auth-service.service";
import {NotifierService} from 'angular-notifier'
import * as CryptoJS from 'crypto-js';

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
      username : ['',[Validators.required, Validators.email]],
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

/*  verifyIsLogout(){
    const  tokenAuth = localStorage.getItem('token');
    if (tokenAuth != null){
      const rus = localStorage.getItem('rus');
      const rol = this.CryptoJSAesDecrypt(this.secretrol, rus);
      switch (rol) {
        case 'is_student':
          this.navigate = ['/alumno/panel'];
          break;
        case 'is_teacher':
          this.navigate = ['/docente/panel-profesor'];
          break;
        case 'is_academic':
          this.navigate = ['/academico/panel'];
          break;
        case 'is_superuser':
          this.navigate = ['/inicio/panel/super-admin'];
          break;
        case 'is_seller':
          this.navigate = ['/ventas/panel'];
          break;
        case 'is_accounting':
          this.navigate = ['/contabilidad/panel'];
          break;
        case 'is_cobranza':
          this.navigate = ['/cobranza/panel'];
          break;
        case 'is_finance':
          this.navigate = ['/finanza/panel'];
          break;
        case 'is_gerente':
          this.navigate = ['/gerencia/panel'];
          break;
        case 'is_admin':
          this.navigate = ['/admin-academico/panel'];
          break;
        case 'is_lider_venta':
          this.navigate = ['/vendedor-lider/panel'];
          break;
        case 'is_jefe_cobranza':
          this.navigate = ['/jefe-cobranza/panel'];
          break;
        default:
          this.navigate = ['/']
      }
      return this.routes.navigate(this.navigate);
    }
  }*/

  login(){
    this.disabled = "btn-loading"
    let user= this.loginForm.controls['username'].value
    let pass= this.loginForm.controls['password'].value

    const body={
      "username": user,
      "password": pass
    }
    this.loginService.login(body).subscribe( resp => {
      if (resp.token) {
        console.log('123')
        this.notifier.notify('success', '¡Logeado Coreectamente!');
        this.router.navigate(['/almacen/dashboard'])
        console.clear()
      }
    }, error => {
      if (error.status === 401) {
        console.log('123')
        this.notifier.notify('error', '¡Nombre de usuario o contraseña incorrectos!');
      }
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
