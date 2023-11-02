import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import Swal from "sweetalert2";
import localeEs from '@angular/common/locales/es';
import { DatePipe, registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class PerfilComponent implements OnInit {
  @ViewChild('passwordEyeRegister') passwordEye:any;
  @ViewChild('passwordEyeRegister2') passwordEye2:any;
  @ViewChild('passwordEyeRegister3') passwordEye3:any;
  @ViewChild('add') private modalContentAdd: TemplateRef<PerfilComponent>;
  private modalRefAdd: NgbModalRef;

  constructor(private spinner: NgxSpinnerService,private modalService: NgbModal, private fb: FormBuilder, private service: GeneralService) { }
  
  formPass = this.fb.group({
    old_pass: [null, Validators.required],
    new_pass: [null, Validators.required],
    confirm_pass: [null, Validators.required]
  });

  passwordTypeInput  =  'password';  passwordTypeInput2  =  'password';  passwordTypeInput3  =  'password';
  iconpassword  =  'eye';  iconpassword2  =  'eye';  iconpassword3  =  'eye';

  profile:any;

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.spinner.show()
    this.service.getProfile().subscribe(resp=>{
      if(resp.success){
        this.profile=resp.data;
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
      this.spinner.hide()
    })
  }

  openModal(){
    this.formPass.reset()
    this.modalRefAdd = this.modalService.open(this.modalContentAdd, {backdrop : 'static', centered: true, 
      windowClass: 'animate__animated animate__backInUp', size: 'sm' });
    this.modalRefAdd.result.then();
  }

  closeModal(){
    this.modalRefAdd.close()
  }

  update(){}

  togglePasswordMode() {
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
    this.iconpassword = this.iconpassword === 'eye-slash' ? 'eye' : 'eye-slash';
    //this.passwordEye.el.setFocus()
  }

  togglePasswordMode2() {
    this.passwordTypeInput2 = this.passwordTypeInput2 === 'text' ? 'password' : 'text';
    this.iconpassword2 = this.iconpassword2 === 'eye-slash' ? 'eye' : 'eye-slash';
    //this.passwordEye.el.setFocus()
  }

  togglePasswordMode3() {
    this.passwordTypeInput3 = this.passwordTypeInput3 === 'text' ? 'password' : 'text';
    this.iconpassword3 = this.iconpassword3 === 'eye-slash' ? 'eye' : 'eye-slash';
    //this.passwordEye.el.setFocus()
  }
}
