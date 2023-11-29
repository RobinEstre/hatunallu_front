import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import {Router} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/panel/services/general.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
  
  formPass = this.fb.group({
    banco: [null, Validators.required],
    operacion: [null, Validators.required],
    fecha: [null, Validators.required]
  });

  formRegister = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    numDoc: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
    pais: [null],
    prefijo: [null],
  });
  banco:any=[
    {
      id:0,
      name:"INTERBANK"
    },
    {
      id:0,
      name:"BCP"
    },
    {
      id:0,
      name:"BBVA"
    },
    {
      id:0,
      name:"SCOTIABANK"
    },
  ]
  pais:any=[]; prefijo:any=[]; files: File[] = []; packs:any

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.spinner.show();
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
      let id_Peru:any='PER'
      this.formRegister.controls.pais.setValue(id_Peru)
      this.prefijo.forEach(i=>{
        if(i.id=='PER'){
          this.formRegister.controls.prefijo.setValue(i.id)
        }
      })
      this.listPacks()
    })
  }

  listPacks(){
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

  openModal(){
    this.formPass.reset()
    this.modalRefAdd = this.modalService.open(this.modalContentAdd, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'sm', keyboard: false  });
    this.modalRefAdd.result.then();
  }

  closeModal(){
    this.modalRefAdd.close()
  }

  update(){}

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

  onSelect(event: { addedFiles: any; }) {
    this.files=[]
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }
}
