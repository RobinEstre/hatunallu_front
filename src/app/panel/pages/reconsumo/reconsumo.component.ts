import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reconsumo',
  templateUrl: './reconsumo.component.html',
  styleUrls: ['./reconsumo.component.scss']
})
export class ReconsumoComponent implements OnInit {

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService,private service: GeneralService) { }

  formPass = this.fb.group({
    banco: [null, Validators.required],
    operacion: [null, Validators.required],
    fecha: [null, Validators.required]
  });

  productos:any; banco:any; data_productos:any=[]; total_precio:any=0; files: File[] = []

  ngOnInit(): void {
    this.list()
  }

  list(){
    this.spinner.show();
    this.service.getProductos().subscribe(resp=>{
      if(resp.success){
        this.productos=resp.data
        this.spinner.hide();
      }
    })
    this.service.getBancos().subscribe(resp=>{
      if(resp.success){
        this.banco=resp.data
      }
    })
  }

  onSelect(event) {
    //console.log(event.target.files)
    this.files=[]
    this.files.push(event.target.files);
  }

  getCantidad(event, data){
    const inputValue = event.target.value;
    let id= data.id
    let elemento :any = document.getElementById(id);
    if(inputValue>=0){
      if(this.data_productos.length>0){
        let verificar:any=false
        this.data_productos.forEach(i=>{
          if(i.id==data.id){verificar=true}
        })
        if(verificar==true){
          this.data_productos.forEach(i=>{
            if(i.id==data.id){
              if(inputValue>0){
                i.cantidad=+inputValue
                i.total= (+inputValue)*(+i.precio)
              }else{
                const index = this.data_productos.findIndex( x => x.id === i.id );
                
                this.data_productos.splice( index, 1 );
                console.log( this.data_productos);
              }
            }
          })
        }else{
          this.data_productos.push({
            id: data.id,
            cantidad: +inputValue,
            precio: +data.precio,
            total: (+inputValue)*(+data.precio)
          })
        }
      }else{
        this.data_productos.push({
          id: data.id,
          cantidad: +inputValue,
          precio: +data.precio,
          total: (+inputValue)*(+data.precio)
        })
      }
    }else{
      elemento.value = 0;
    }
    
    if(this.data_productos.length>0){
      let total:any=0, cantidad:any=0
      this.data_productos.forEach(i=>{
        total += i.total
        cantidad += i.cantidad
      })
      if(cantidad>=6){
        let descuento:any=0
        if(this.data_productos[0].precio==80){descuento=60}
        if(this.data_productos[0].precio==90){descuento=80}
        if(this.data_productos[0].precio==100){descuento=100}
        if(this.data_productos[0].precio==110){descuento=120}
        if(this.data_productos[0].precio==120){descuento=140}
        if(this.data_productos[0].precio==130){descuento=160}
        this.total_precio=total-descuento
      }else{
        this.total_precio=total
      }
    }else{
      this.total_precio=0
    }
  }

  update(){
    this.spinner.show()
    for(let a=0; a<this.files.length; a++){
      const formData = new FormData()
      formData.append("bucket", 'jatun-files');
      formData.append("nombre", this.files[a].name);
      formData.append("folder", 'vouchers-reconsumo/');
      formData.append('files', this.files[a], this.files[a].name);

      this.service.subirIMG(formData).subscribe(data => {
        if(data['success']==true){
          let url= data['data'][0]['url']
          this.registrarReconsumo(url)
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

  registrarReconsumo(url){
    let productos:any=[]
    this.data_productos.forEach(i=>{
      productos.push({        
        "producto_id":i.id,
        "cantidad": i.cantidad
      })
    })
    let body={
      "num_operacion": this.formPass.controls.operacion.value,
      "url_voucher": url,
      "productos": productos
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
