import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {Subject} from "rxjs";
import localeEs from '@angular/common/locales/es';
import Swal from "sweetalert2";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import { GeneralService } from '../../services/general.service';
import { FormBuilder, Validators } from '@angular/forms';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-h-comisiones',
  templateUrl: './h-comisiones.component.html',
  styleUrls: ['./h-comisiones.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class HComisionesComponent implements OnInit {
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<HComisionesComponent>;
  private modalRefIMG: NgbModalRef;

  constructor(private spinner: NgxSpinnerService, private service: GeneralService, private datePipe: DatePipe, private fb: FormBuilder,
    private modalService: NgbModal,) { 
  }
  
  formfiltros = this.fb.group({
    mes: [null, Validators.required],
    ano: [null, Validators.required],
  });

  ganancia_afiliados:any=0; ganancia_reconsumo:any=0; ganancia_rango:any=0; f_inicio:any; f_fin:any; afiliados:boolean=false; id_user:any;
  data_pago:any; data_detalle:any
  mes:any=[{id:1, name:'Enero'},{id:2, name:'Febrero'},{id:3, name:'Marzo'},{id:4, name:'Abril'},{id:5, name:'Mayo'},{id:6, name:'Junio'},
  {id:7, name:'Julio'},{id:8, name:'Agosto'},{id:9, name:'Septiembre'},{id:10, name:'Octubre'},{id:11, name:'Noviembre'},{id:12, name:'Diciembre'}]
  ano:any=[{name:2023},{name:2024},{name:2025},{name:2026},{name:2027},{name:2028},{name:2029},{name:2030}]

  ngOnInit(): void {
    const start = new Date();
    let mes:any = start.getMonth()+1
    let ano:any = start.getFullYear()
    this.formfiltros.controls.mes.setValue(mes)
    this.formfiltros.controls.ano.setValue(ano)
    this.listInit()
  }

  listInit(){
    this.spinner.show()
    this.service.getProfile().subscribe(resp => {
      if(resp['success']==true){
        this.id_user=resp.data_usuario.persona
        this.data_detalle=resp.data_usuario
        this.getFechas()
        this.getPago()
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

  getPago(){
    let mes:any = this.formfiltros.controls.mes.value, ano:any=this.formfiltros.controls.ano.value
    this.data_pago= null
    this.service.getHistoryPagosId(this.id_user, mes, ano).subscribe(resp => {
      if(resp['success']==true){
        this.data_pago= resp.data
      }
    },error => {
      if(error.status==400){
        // Swal.fire({
        //   title: 'Advertencia!',
        //   text: error.error.message,
        //   icon: 'error',
        //   showCancelButton: true,
        //   showConfirmButton: false,
        //   cancelButtonColor: '#c02c2c',
        //   cancelButtonText: 'Cerrar'
        // })
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

  getFechas(){
    let mes:any = this.formfiltros.controls.mes.value, ano:any=this.formfiltros.controls.ano.value
    let dia=30
    if(mes==1||mes==3||mes==5||mes==7||mes==8||mes==10||mes==12){
      dia=31
    }
    let dateStart = ano+'-'+this.zfill(mes, 2)+'-01T00:00:00' 
    let dateFin = ano+'-'+this.zfill(mes, 2)+'-'+dia+'T23:59:59'
    let start = new Date(dateStart);
    let end = new Date(dateFin);
    let inicio:any = this.datePipe.transform(start, "yyyy-MM-ddTHH:mm:ss")
    let fin:any = this.datePipe.transform(end, "yyyy-MM-ddTHH:mm:ss")
    this.f_inicio=inicio
    this.f_fin=fin
    console.log(start)
    console.log(end)
    this.getMontos()
  }

  getMontos(){
    let start = new Date(this.f_inicio);
    let end = new Date(this.f_fin);
    let f_inicio = start.getTime() / 1000;
    let f_fin = end.getTime() / 1000;
    let params = `fecha_inicio=${f_inicio}&fecha_fin=${f_fin}`
    this.service.getComisiones2(this.id_user, params).subscribe(resp => {
      if(resp['success']==true){
        this.ganancia_afiliados=+resp['ganancia_total']
        let data={
          id: this.id_user,
          inicio: this.f_inicio,
          fin: this.f_fin
        }
        this.service.getComisionesReconsumo(data).subscribe(resp => {
          if(resp['success']==true){
            let total=0
            resp.cantidad_puntos.forEach(i=>{
              total += i.ganancia
            })
            this.ganancia_reconsumo=total
            this.ganancia_rango=resp.rango
            this.afiliados=true
            this.spinner.hide()
          }
        },error => {
          if (error.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: error.error['message'],
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d37c0c',
              cancelButtonText: 'Cerrar'
            })
          }
          if (error.status === 500) {
            Swal.fire({
              title: 'Error!',
              text: 'Comuniquese con el Area de Sistemas',
              icon: 'error',
              showCancelButton: true,
              showConfirmButton: false,
              cancelButtonColor: '#d37c0c',
              cancelButtonText: 'Cerrar'
            })
          }
          this.spinner.hide()
        })
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

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
  }

  // getfechainicio(){
  //   let date:any=this.formfiltros.controls.fecha_inicio.value
  //   //console.log(date)
  //   const start = new Date(date);
  //   start.setDate(start.getDate() + 1)
  //   start.setHours(0, 0, 0, 0);
  //   let inicio:any = this.datePipe.transform(start, "yyyy-MM-dd")
  //   this.f_inicio = start.getTime() / 1000;
  //   console.log(this.f_inicio)
  //   console.log(inicio)
  // }

  // getfechafin(){
  //   let date:any=this.formfiltros.controls.fecha_fin.value
  //   const end = new Date((date));
  //   end.setDate(end.getDate() + 1)
  //   end.setHours(23, 59, 59, 999);
  //   let fin = this.datePipe.transform(end, "yyyy-MM-dd")
  //   this.f_fin = end.getTime() / 1000;
  // }

  refreshData(){
    this.afiliados=false
    this.ganancia_afiliados=0
    this.ganancia_reconsumo=0
    this.listInit()
  }

  selectMes(event){
    try{
      let id= event.id
    }catch(e){
      this.afiliados=false
      // const start = new Date();
      // let mes:any = start.getMonth()+1
      // this.formfiltros.controls.mes.setValue(mes)
    }
  }

  selectAno(event){
    try{
      let id= event.id
    }catch(e){
      this.afiliados=false
      // const start = new Date();
      // let ano:any = start.getFullYear()
      // this.formfiltros.controls.ano.setValue(ano)
    }
  }

  openModalIMG(){
    this.modalRefIMG = this.modalService.open(this.modalContentIMG, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'md' });
    this.modalRefIMG.result.then();
  }

  closeModalIMG(){
    this.modalRefIMG.close()
  }
}
