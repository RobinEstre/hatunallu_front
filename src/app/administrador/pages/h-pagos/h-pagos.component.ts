import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, registerLocaleData} from "@angular/common";
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-h-pagos',
  templateUrl: './h-pagos.component.html',
  styleUrls: ['./h-pagos.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class HPagosComponent implements OnInit {
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<HPagosComponent>;
  private modalRefIMG: NgbModalRef;
  public static spanish_datatables = {
    processing: "Procesando...",
    search: "Buscar:",
    lengthMenu: "Mostrar _MENU_ elementos",
    info: "Mostrando desde _START_ al _END_ de _TOTAL_ elementos",
    infoEmpty: "Mostrando ningún elemento.",
    infoFiltered: "(filtrado _MAX_ elementos total)",
    infoPostFix: "",
    loadingRecords: "Cargando registros...",
    zeroRecords: "No se encontraron registros",
    emptyTable: "No hay datos disponibles en la tabla",
    buttons: {
      copy: "Copiar",
      colvis: "Visibilidad",
      collection: "Colección",
      colvisRestore: "Restaurar visibilidad",
      copyKeys: "Presione ctrl o u2318 + C para copiar los datos de la tabla al portapapeles del sistema. <br \/> <br \/> Para cancelar, haga clic en este mensaje o presione escape.",
      copySuccess: {
        1: "Copiada 1 fila al portapapeles",
        _: "Copiadas %ds fila al portapapeles"
      },
      copyTitle: "Copiar al portapapeles",
      csv: "CSV",
      excel: "Excel",
      pageLength: {
        1: "Mostrar todas las filas",
        _: "Mostrar %d filas"
      },
      pdf: "PDF",
      print: "Imprimir",
      renameState: "Cambiar nombre",
      updateState: "Actualizar",
      createState: "Crear Estado",
      removeAllStates: "Remover Estados",
      removeState: "Remover",
      savedStates: "Estados Guardados",
      stateRestore: "Estado %d"
    },
    paginate: {
      first: "Primero",
      previous: "Anterior",
      next: "Siguiente",
      last: "Último"
    },
    aria: {
      sortDescending: ": Activar para ordenar la tabla en orden descendente",
      sortAscending: ": Activar para ordenar la tabla en orden ascendente"
    }
  }
  
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  constructor(private spinner: NgxSpinnerService, private service: AdminService, private datePipe: DatePipe, private fb: FormBuilder,
    private modalService: NgbModal,) { 
  }
  
  formfiltros = this.fb.group({
    mes: [null, Validators.required],
    ano: [null, Validators.required],
  });
  
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();
  
  mes:any=[{id:1, name:'Enero'},{id:2, name:'Febrero'},{id:3, name:'Marzo'},{id:4, name:'Abril'},{id:5, name:'Mayo'},{id:6, name:'Junio'},
  {id:7, name:'Julio'},{id:8, name:'Agosto'},{id:9, name:'Septiembre'},{id:10, name:'Octubre'},{id:11, name:'Noviembre'},{id:12, name:'Diciembre'}]
  ano:any=[{name:2023},{name:2024},{name:2025},{name:2026},{name:2027},{name:2028},{name:2029},{name:2030}]

  pagos:any; params:any; f_inicio:any; f_fin:any; data_detalle:any; files:any; data_pago:any

  ngOnInit(): void {
    const start = new Date();
    let mes:any = start.getMonth()+1
    let ano:any = start.getFullYear()
    this.formfiltros.controls.mes.setValue(mes)
    this.formfiltros.controls.ano.setValue(ano)
    this.getFechas()
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listInit(){
    this.spinner.show()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0,'desc'],
      dom: 'Bfrtip',
      buttons: [
        { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Historial Pagos'},
        { extend: 'copy', className: 'btn btn-primary text-white', title:'Historial Pagos'},
        { extend: 'print', className: 'btn btn-danger text-white', title:'Historial Pagos'},
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Historial Pagos'}
      ],
      language: HPagosComponent.spanish_datatables
    }
    let mes:any = this.formfiltros.controls.mes.value, ano:any=this.formfiltros.controls.ano.value
    this.params = `fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}&num_month=${this.zfill(mes, 2)}&num_year=${ano}`
    this.service.getHistoryPagos(this.params).subscribe(resp => {
      if(resp['success']==true){
        this.pagos=resp.data
        this.dtTrigger.next();
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
    this.f_inicio=start.getTime()/1000
    this.f_fin=end.getTime()/1000
    this.listInit()
  }

  refreshData(){
    this.spinner.show()
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.getFechas()
    });
  }

  selectMes(event){
    try{
      let id= event.id
    }catch(e){
    }
  }

  selectAno(event){
    try{
      let id= event.id
    }catch(e){
    }
  }

  generatePago(){
    this.spinner.show()
    if(this.files.length>0){
      this.subirIMG()
    }else{
      this.actualizarPago('')
    }
  }

  subirIMG(){
    for(let a=0; a<this.files.length; a++){
      const formData = new FormData()
      formData.append("bucket", 'jatun-files');
      formData.append("nombre", this.files[a].name);
      formData.append("folder", 'fotos-usuarios/');
      formData.append('files', this.files[a], this.files[a].name);

      this.service.subirIMG(formData).subscribe(data => {
        if(data['success']==true){
          let url= data['data'][0]['url']
          this.actualizarPago(url)
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

  actualizarPago(url){
    let mes:any = this.formfiltros.controls.mes.value, ano:any=this.formfiltros.controls.ano.value
    let total= (+this.data_detalle.comision_reconsumos)+(+this.data_detalle.comision_referico)+(+this.data_detalle.rango_ganancia)
    let body={
      "afiliado_id": this.data_detalle.afiliado_idd,
      "comprobante_url": url,
      "importe":total,
      "num_month":mes,
      "num_year":ano
    }
    this.service.registerPago(body).subscribe(data => {
      if(data['success']==true){
        this.closeModalIMG()
        this.spinner.hide()
        this.refreshData()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Pago Realizado Exitoso",
          showConfirmButton: false,
          timer: 2500
        });
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

  validatePago(data){
    let mes:any = this.formfiltros.controls.mes.value, ano:any=this.formfiltros.controls.ano.value
    this.data_pago= null
    if(data.sepaga){
      if(data.is_pagado){
        this.spinner.show()
        this.service.getHistoryPagosId(data.afiliado_idd, mes, ano).subscribe(resp => {
          if(resp['success']==true){
            this.openModalIMG(data)
            this.data_pago= resp.data
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
      }else{
        this.openModalIMG(data)
      }
    }else{
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "No listo para pagar",
        text: "Usuario: "+data.nombre_completo,
        showConfirmButton: false,
        timer: 2500
      });
    }
  }

  openModalIMG(data){
    this.data_detalle=data
    this.modalRefIMG = this.modalService.open(this.modalContentIMG, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'md' });
    this.modalRefIMG.result.then();
  }

  closeModalIMG(){
    this.modalRefIMG.close()
  }

  onSelect(event: { addedFiles: any; }) {
    this.files=[]
    this.files.push(...event.addedFiles);
  }
  
  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
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
}
