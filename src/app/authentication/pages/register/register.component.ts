import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/panel/services/general.service';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class RegisterComponent implements OnInit {
  @ViewChild('add') private modalContentAdd: TemplateRef<RegisterComponent>;
  private modalRefAdd: NgbModalRef;

  email="";
  password="";
  message = '';
  errorMessage = ''; // validation error handle
  error: { name: string, message: string } = { name: '', message: '' }; // for firbase error handle

  constructor(private authservice: AuthServiceService, private router:Router, private fb: FormBuilder,private spinner: NgxSpinnerService,
    private modalService: NgbModal,private service: GeneralService,) {
  }
  date: Date = new Date();
  
  formPass = this.fb.group({
    banco: [null, Validators.required],
    operacion: [null, Validators.required],
    fecha: [null, Validators.required]
  });

  formRegister = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
    numDoc: ['', Validators.required],
    direccion : ['', Validators.required],
    fecha_nac : ['', Validators.required],
    pais: [null, Validators.required],
    prefijo: [null, Validators.required],
    genero : [null, Validators.required],
    departamento : [null, Validators.required],
    provincia : [null, Validators.required],
    distrito : [null, Validators.required],
  });
  pais:any=[
    {
      'id': 1,
      'name': 'Perú'
    },
    {
      'id': 2,
      'name': 'Extranjero'
    },
  ];
  prefijo:any=[
    {
      'id': 'PER',
      'name': '+51'
    },
    {
      'id': 2,
      'name': 'Extranjero'
    },
  ];

  banco:any;genero:any=[{name:'Masculino'},{name:'Femenino'}]; departamento:any; provincia:any; distrito:any
  files: File[] = []; packs:any; validar_pago:boolean=false; data_pago:any; data_pack:any

  ngOnInit(): void {
    this.formRegister.controls.distrito.disable()
    this.formRegister.controls.provincia.disable()
    this.list()
  }

  list(){
    this.spinner.show();
    // this.authservice.listCountry().subscribe(data => {
    //   let dato:any=[], pref:any=[], id
    //   data.forEach(i=>{
    //     dato.push({
    //       name: i.name.common,
    //       id: i.fifa
    //     })
    //   })
    //   data.forEach(i=>{
    //     if(Array.isArray(i.idd.suffixes)){
    //       id=i.idd.suffixes[0]
    //     }else{id=i.idd.suffixes}
    //     dato.push({
    //       name: i.name.common,
    //       id: i.fifa
    //     })
    //     pref.push({
    //       name: i.idd.root+id,
    //       id: i.fifa
    //     })
    //   })
    //   this.prefijo=pref
    //   this.pais=dato
    //   let id_Peru:any='PER'
    //   this.formRegister.controls.pais.setValue(id_Peru)
    //   this.prefijo.forEach(i=>{
    //     if(i.id=='PER'){
    //       this.formRegister.controls.prefijo.setValue(i.id)
    //     }
    //   })
    //   this.listPacks()
    // })
    this.service.getBancos().subscribe(resp=>{
      if(resp.success){
        this.banco=resp.data
      }
    })
    this.service.listDepartamento().subscribe(resp=>{
      if(resp.success){
        this.listPacks()
        this.departamento=resp.data
      }
    })
  }

  listPacks(){
    let id:any='PER', id_pais:any=1
    this.formRegister.controls.prefijo.setValue(id)
    this.formRegister.controls.prefijo.disable()
    this.formRegister.controls.pais.setValue(id_pais)
    this.formRegister.controls.pais.disable()
    this.service.getPacks().subscribe(resp=>{
      if(resp.success){
        let pack:any=[]
        resp.data.forEach(i=>{
          let obj = JSON.parse(i.data);
          pack.push({
            "id": i.id,
            "name": i.name,
            "descriptions": i.descriptions,
            "total_price": i.total_price,
            "is_active": i.is_active,
            "data": obj,
            "created_at": i.created_at,
            "updated_at": i.updated_at
          })
        })
        this.packs=pack
        this.spinner.hide();
      }
    })
  }

  clearErrorMessage(){
    this.errorMessage = '';
    this.error = {name : '' , message:''};
  }

  openModal(data){
    this.data_pack=data
    this.data_pago=null
    this.validar_pago=false
    this.formPass.reset()
    this.modalRefAdd = this.modalService.open(this.modalContentAdd, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'sm', keyboard: false  });
    this.modalRefAdd.result.then();
  }

  closeModal(){
    this.modalRefAdd.close()
  }

  update(){
    this.spinner.show()
    for(let a=0; a<this.files.length; a++){
      const formData = new FormData()
      formData.append("bucket", 'jatun-files');
      formData.append("nombre", this.files[a].name);
      formData.append("folder", 'vouchers-referido/');
      formData.append('files', this.files[a], this.files[a].name);

      this.service.subirIMG(formData).subscribe(data => {
        if(data['success']==true){
          let url= data['data'][0]['url']
          this.data_pago={
            "num_operacion": this.formPass.controls.operacion.value,
            "url_comprobante": url,
            "importe": +this.data_pack.total_price,
            "banco_id": this.formPass.controls.banco.value,
            "fecha_pago": this.formPass.controls.fecha.value,
          }
          this.validar_pago=true
          this.closeModal()
          this.spinner.hide()
        }
      },error => {
        if(error.status==400){
          Swal.fire({
            title: 'Advertencia!',
            text: error.error.message,
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#c02c2c',
            cancelButtonText: 'Cerrar'
          })
        }
        if(error.status==500){
          Swal.fire({
            title: 'Advertencia!',
            text: 'Comuniquese con el Área de Sistemas',
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#c02c2c',
            cancelButtonText: 'Cerrar'
          })
        }
        // this.closeModal()
        this.spinner.hide()
      })
    }
  }

  register(){
    if(this.data_pago){
      this.spinner.show()
      let masculino=false, femenino=false
      if(this.formRegister.controls.genero.value=='Masculino'){masculino=true}
      if(this.formRegister.controls.genero.value=='Femenino'){femenino=true}
      let body={
        "referido": {
          "email": this.formRegister.controls.email.value,
          "dni": this.formRegister.controls.numDoc.value, 
          "nombre": this.formRegister.controls.nombres.value,
          "apellido": this.formRegister.controls.apellidos.value,
          "telefono" : this.formRegister.controls.celular.value,
          "direccion" : this.formRegister.controls.direccion.value,
          "fecha_nacimiento": this.formRegister.controls.fecha_nac.value,
          "is_masculino": masculino,
          "is_femenino": femenino,
          "data": {
            "pais": this.formRegister.controls.pais.value,
            "prefijo": this.formRegister.controls.prefijo.value,
            "url_img":"",
            "departamento_id": this.formRegister.controls.departamento.value,
            "provincia_id": this.formRegister.controls.provincia.value,
            "distrito_id": this.formRegister.controls.distrito.value
          }
        },
        "num_operacion": this.data_pago.num_operacion,
        "url_comprobante": this.data_pago.url_comprobante,
        "importe": this.data_pago.importe,
        "banco_id": this.data_pago.banco_id,
        "estado_id": 1,
        "patrocinador_id": 10,
        "fecha_pago": this.data_pago.fecha_pago,
        "pack_id": this.data_pack.id
      }
      this.service.registerClient(body).subscribe(resp=>{
        if(resp.success){
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registrado Correctamente Esperar la Validación",
            showConfirmButton: false,
            timer: 2500
          });
          this.validar_pago=false
          this.formRegister.reset()
          this.formPass.reset()
          this.spinner.hide()
          setTimeout(() => {
            this.router.navigate(['/auth/login'])
          }, 2500);
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
    this.formRegister.controls.numDoc.setValue('')
    this.formRegister.controls.nombres.setValue('')
    this.formRegister.controls.apellidos.setValue('')
    this.prefijo.forEach(i=>{
      if(i.id==event.id){
        this.formRegister.controls.prefijo.setValue(i.id)
      }
    })
  }

  selectDepartamento(event){
    try{
      this.formRegister.controls.provincia.enable()
      this.formRegister.controls.distrito.enable()
      this.service.listProvincia(event.id_dep).subscribe(resp=>{
        if(resp.success){
          this.provincia=resp.data
        }
      })
    }catch(e){
      this.formRegister.controls.distrito.setValue(null)
      this.formRegister.controls.provincia.setValue(null)
      this.formRegister.controls.distrito.disable()
      this.formRegister.controls.provincia.disable()
    }
  }

  selectProvincia(event){
    try{
      this.formRegister.controls.distrito.enable()   
      this.service.listDistrito(event.id_pro).subscribe(resp=>{
        if(resp.success){
          this.distrito=resp.data
        }
      })   
    }catch(e){
      this.formRegister.controls.distrito.setValue(null)
      this.formRegister.controls.distrito.disable()
    }
  }

  getInfoCliente(event){
    const inputValue = event.target.value;
    let num_doc= this.formRegister.controls.numDoc.value
    //if(this.formRegister.controls.pais.value=='PER'){
    if(inputValue.length === 8){
      this.formRegister.controls.numDoc.disable()
      this.spinner.show()
      this.service.getDni(num_doc).subscribe(dni=>{
        if(dni.success){
          this.formRegister.controls.nombres.setValue(dni['data']['nombres'])
          this.formRegister.controls.apellidos.setValue(dni['data']['apellidoPaterno']+' '+dni['data']['apellidoMaterno'])
          this.formRegister.controls.numDoc.enable()
          this.spinner.hide()
          return
        }else{
          this.formRegister.controls.numDoc.setValue('')
          this.formRegister.controls.numDoc.enable()
          this.spinner.hide()
          return
        }
      },error => {
        if(error.status==400) {
          Swal.fire({
            title: 'Advertencia!',
            text: error.error.error,
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#c02c2c',
            cancelButtonText: 'Cerrar'
          })
        }
        if(error.status==500){
          Swal.fire({
            title: 'Advertencia!',
            text: 'Comuniquese con el Área de Sistemas',
            icon: 'error',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: '#c02c2c',
            cancelButtonText: 'Cerrar'
          })
        }
        this.formRegister.controls.numDoc.setValue('')
        this.formRegister.controls.numDoc.enable()
        this.spinner.hide()
      })
    }
    else{
      this.formRegister.controls.nombres.setValue('')
      this.formRegister.controls.apellidos.setValue('')
    }
    //}
  }

  onSelect(event: { addedFiles: any; }) {
    this.files=[]
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
