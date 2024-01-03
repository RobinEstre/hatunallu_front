import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cambio-referido',
  templateUrl: './cambio-referido.component.html',
  styleUrls: ['./cambio-referido.component.scss']
})
export class CambioReferidoComponent implements OnInit {

  constructor(private service: AdminService,private spinner: NgxSpinnerService,private fb: FormBuilder,) { }

  formReferidos = this.fb.group({
    numDoc: ['', Validators.required],
    numDocPadre: ['', Validators.required],
  });

  data_referidos:any; detalle_referido:any; detalle_padre:any

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.spinner.show()
    this.service.listReferidos().subscribe(resp=>{
      if(resp.success){
        this.data_referidos=resp.data
        console.log(resp.data)
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

  getInfoReferido(event){
    const inputValue = event.target.value;
    let num_doc= this.formReferidos.controls.numDoc.value
    this.detalle_referido=null
    this.detalle_padre=null
    if(inputValue.length === 8){
      this.data_referidos.forEach(i=>{
        if(i.dni_hijo==num_doc){
          this.detalle_referido=i
        }
      })
    }
    else if(inputValue.length > 8){
      this.formReferidos.controls.numDoc.setValue('')
      this.detalle_referido=null
      this.detalle_padre=null
    }else{
      this.detalle_referido=null
      this.detalle_padre=null
    }
  }

  getInfoPadre(event){
    const inputValue = event.target.value;
    let num_doc= this.formReferidos.controls.numDocPadre.value
    this.detalle_padre=null
    if(inputValue.length === 8){
      if(num_doc==this.formReferidos.controls.numDoc.value){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "El referido no puede ser el mismo padre",
          showConfirmButton: false,
          timer: 1500
        });
        this.formReferidos.controls.numDocPadre.setValue('')
      }else{
        this.spinner.show()
        this.service.listPersona(this.detalle_referido.hijo_id).subscribe(resp=>{
          if(resp.success){
            resp.data.forEach(i=>{
              if(i.dni==num_doc){
                this.detalle_padre=i
              }
            })
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
    else if(inputValue.length > 8){
      this.formReferidos.controls.numDocPadre.setValue('')
      this.detalle_padre=null
    }else{
      this.detalle_padre=null
    }
  }
  
  changePadre(){
    this.spinner.show()
    let body={
      "persona_id": this.detalle_referido.hijo_id,
      "padre_id": this.detalle_referido.padre_id,
      "new_padre_id": this.detalle_padre.id
    }
    this.service.changePadre(body).subscribe(resp=>{
      if(resp.success){
        this.formReferidos.reset()
        this.detalle_padre=null
        this.detalle_referido=null
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Se cambio correctamente de Patrocinador",
          showConfirmButton: false,
          timer: 2000
        });
        this.listInit()
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
