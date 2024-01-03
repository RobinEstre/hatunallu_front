import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');


@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class RecoverPasswordComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(private router: Router, private formBuilder : FormBuilder,private loginService: AuthServiceService,private toastr: ToastrService) { 
    this.loginForm = this.formBuilder.group({
      username : ['',[Validators.required]]
    });
  }
  date: Date = new Date();

  disabled = ""; active:any;

  ngOnInit(): void {
  }

  login(){
    this.disabled = "btn-loading"
    let user= this.loginForm.controls['username'].value

    const body={
      "num_documento": user,
    }
    this.loginService.recoverPassword(body).subscribe( resp => {
      if (resp.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Se envió un mensaje a su correo electrónico",
          showConfirmButton: false,
          timer: 2500
        });
        setTimeout(() => {
          this.disabled=""
          this.router.navigate(['/auth/login'])
        }, 2500);
      }
    }, error => {
      this.disabled=""
      if (error.status === 500){
        Swal.fire({
          title: 'Oops!',
          text: 'Ocurrio un incidente en el servidor, contactate con el area de sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar ventana'
        })
      }else if (error.status === 400){
        Swal.fire({
          title: 'Oops!',
          text: error.error.message,
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar ventana'
        })
      }
    })
  }
}
