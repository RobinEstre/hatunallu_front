import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/panel/services/general.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-register-link',
  templateUrl: './register-link.component.html',
  styleUrls: ['./register-link.component.scss']
})
export class RegisterLinkComponent implements OnInit {

  email="";
  password="";
  message = '';
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle
  code:any

  constructor(private authservice: AuthServiceService, private router:Router, private fb: FormBuilder,private spinner: NgxSpinnerService,
    private service: GeneralService, private toastr: ToastrService,private route: ActivatedRoute,) { 
    this.code = this.route.snapshot.params['code']
  }

  formRegister = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
    monto : ['', Validators.required],
    pais: [null],
    prefijo: [null],
  });

  pais:any=[];prefijo:any=[]; packs:any; validate_pack:any=false;detail_pack:any; code_url:any

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.spinner.show();
    this.service.getPacks().subscribe(resp=>{
      if(resp.success){
        this.packs=resp.data
      }
    })
    this.service.validateCodeURL(this.code).subscribe(resp=>{
      if(resp.success){
        this.code_url=resp.data
        this.listCountries()
      }
    }, error => {
      this.spinner.hide()
      this.router.navigate(['/auth/login'])
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
  
  listCountries(){
    this.authservice.listCountry().subscribe(data => {
      let dato:any=[], pref:any=[], id
      data.forEach(i=>{
        dato.push({
          name: i.name.common,
          id: i.fifa
        })
      })
      data.forEach(i=>{
        if(Array.isArray(i.idd.suffixes)){
          id=i.idd.suffixes[0]
        }else{id=i.idd.suffixes}
        dato.push({
          name: i.name.common,
          id: i.fifa
        })
        pref.push({
          name: i.idd.root+id,
          id: i.fifa
        })
      })
      this.prefijo=pref
      this.pais=dato
      this.spinner.hide();
    })
  }

  clearErrorMessage(){
    this.errorMessage = '';
    this.error = {name : '' , message:''};
  }

  getPack(event){
    const value = +event.target.value;
    //const value:any = this.formRegister.controls.monto.value;
    if(+value<1 || +value==0){this.formRegister.controls.monto.setValue('');this.validate_pack=false}
    else{this.validatePack(value)}
    console.log(value)
  }

  validatePack(value){
    this.packs.forEach(i=>{
      let data= JSON.parse(i.data)
      if(+data.rango[0]<=+value&&+value<=+data.rango[1]){
        console.log(data.rango[0]+','+value+','+data.rango[1])
        this.validate_pack=true
        this.detail_pack=i
      }
    })
  }

  register(){
    this.clearErrorMessage();
    if (this.validateForm(this.email, this.password)) {
      // this.authservice.registerWithEmail(this.email, this.password).then(() => {
      //   this.message = "you are register with data on firbase"
      //   this.router.navigate(['/dashboard'])
      // }).catch((_error:any) => {
      //   this.error = _error
      //   this.router.navigate(['/auth/register'])
      // })
    }
  }

  validateForm(email:string, password:string){
    if(email.length === 0)
    {
      this.errorMessage = "please enter email id";
      return false;
    }

    if (password.length === 0) {
      this.errorMessage = "please enter password";
      return false;
    }

    if (password.length < 6)
    {
      this.errorMessage = "password should be at least 6 char";
      return false;
    }

    this.errorMessage = '';
    return true;

  }

  selectPais(event){
    this.prefijo.forEach(i=>{
      if(i.id==event.id){
        this.formRegister.controls.prefijo.setValue(i.id)
      }
    })
  }
}
