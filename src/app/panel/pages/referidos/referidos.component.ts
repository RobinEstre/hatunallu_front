import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthServiceService } from 'src/app/authentication/services/auth-service.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from '../../services/general.service';
import { Clipboard } from '@angular/cdk/clipboard';
import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referidos',
  templateUrl: './referidos.component.html',
  styleUrls: ['./referidos.component.scss']
})
export class ReferidosComponent implements OnInit {
  @ViewChild('modal_pago') private modalContent: TemplateRef<ReferidosComponent>;
  private modalRef: NgbModalRef;

  constructor(private fb: FormBuilder,private spinner: NgxSpinnerService,private authservice: AuthServiceService,private modalService: NgbModal,
    private service: GeneralService, private clipboard: Clipboard, private toastr: ToastrService) { }

  formRegister = this.fb.group({
    nombres : ['',Validators.required],
    apellidos : ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    celular : ['', Validators.required],
    monto : ['', Validators.required],
    pais : [null],
    prefijo : [null],
  });

  pais:any=[]; prefijo:any=[]; packs:any; validate_pack:any=false; detail_pack:any; info_qr:any; text_modal:any; textoACopiar:any

  ngOnInit(): void {
    this.listCountries()
  }

  listCountries(){
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
      this.listInit()
    })
  }

  listInit(){
    this.service.getQr().subscribe(resp=>{
      if(resp.success){
        if(resp.info==null){
          this.generateQr()
        }else{
          this.info_qr=resp.info
          this.textoACopiar='http://localhost:4200/auth/register-link/'+this.info_qr.code_url
        }
      }
    })
    this.service.getPacks().subscribe(resp=>{
      if(resp.success){
        this.packs=resp.data
        this.spinner.hide();
      }
    })
  }

  copiar() {
    this.clipboard.copy(this.textoACopiar);    
    this.toastr.success('Link copiado', 'Genial!');
  }

  generateQr(){
    this.service.registerQr().subscribe(data=>{
      if(data.success){
        this.listInit()
      }
    })
  }

  selectPais(event){
    this.prefijo.forEach(i=>{
      if(i.id==event.id){
        this.formRegister.controls.prefijo.setValue(i.id)
      }
    })
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

  openModal(text) {
    this.text_modal=text
    this.modalRef = this.modalService.open(this.modalContent, { centered: true, size: 'md', keyboard: false, backdrop: 'static' });
    this.modalRef.result.then();
  }

  closeModal() {
    this.modalRef.close();
  }

  sendData(){
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
      "red_data": null //opcional
    }
    this.service.registerClient(body).subscribe(resp=>{
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
