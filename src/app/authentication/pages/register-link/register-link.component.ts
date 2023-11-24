import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/panel/services/general.service';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from "sweetalert2";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-register-link',
  templateUrl: './register-link.component.html',
  styleUrls: ['./register-link.component.scss']
})
export class RegisterLinkComponent implements OnInit {
  @ViewChild('modal_binance') private modalContentBinance: TemplateRef<RegisterLinkComponent>;
  private modalRefBinance: NgbModalRef;

  email="";
  password="";
  message = '';
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle
  code:any

  constructor(private authservice: AuthServiceService, private router:Router, private fb: FormBuilder,private spinner: NgxSpinnerService,
    private service: GeneralService, private toastr: ToastrService,private route: ActivatedRoute,private modalService: NgbModal, 
    private clipboard: Clipboard,) { 
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

  pais:any=[];prefijo:any=[]; packs:any; validate_pack:any=false;detail_pack:any; code_url:any;  data_binance:any; txtCopiarBinance:any


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
    this.spinner.show()
    let body={
      "cliente": {
        "nombre": this.formRegister.controls.nombres.value,
        "apellido": this.formRegister.controls.apellidos.value,
        "email": this.formRegister.controls.email.value,
        "telefono": this.formRegister.controls.celular.value,
        "dni": null,
        "fecha_nacimiento": null,
        "direccion": null,
        "data": {
          "pais": this.formRegister.controls.pais.value,
          "prefijo": this.formRegister.controls.prefijo.value
        }
      },
      "orderAmount": this.formRegister.controls.monto.value, //monto
      "currency": "USDT", //defecto
      "description_pay": "pago inscripcion", //defecto
      "pack": {
        "pack_id": this.detail_pack.id,
        "forma_ganar_id": 1, //defecto
        "tipo_venta_id": 1, //defecto
        "pack_data": null //opcional
      },
      "red_data": null, //opcional
      "qr_code": this.code
    }
    this.service.registerClientLink(body).subscribe(resp=>{
      if(resp.success){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registrado Correctamente",
          showConfirmButton: false,
          timer: 1500
        });
        this.validate_pack=false
        this.formRegister.reset()
        this.spinner.hide()
        this.data_binance=resp.data
        this.openModalBinance()
      }
    }, error => {
      this.spinner.hide()
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

  openModalBinance() {
    this.txtCopiarBinance = this.data_binance.data.checkoutUrl
    this.modalRefBinance = this.modalService.open(this.modalContentBinance, { centered: true, size: 'md', keyboard: false, backdrop: 'static' });
    this.modalRefBinance.result.then();
  }

  closeModalBinance() {
    this.modalRefBinance.close();
  }
  
  copiarLink() {
    this.clipboard.copy(this.txtCopiarBinance);
    this.toastr.success('Link copiado', 'Genial!');
  }
}
