import { Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Swal from "sweetalert2";
import {Subject} from "rxjs";
import localeEs from '@angular/common/locales/es';
import { DataTableDirective } from 'angular-datatables';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-h-mes',
  templateUrl: './h-mes.component.html',
  styleUrls: ['./h-mes.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class HMesComponent implements OnInit {
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<HMesComponent>;
  private modalRefIMG: NgbModalRef;
  @ViewChild('modal_afiliado') private modalContentAf: TemplateRef<HMesComponent>;
  private modalRefAf: NgbModalRef;
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
    estados: [null, Validators.required],
    fecha_inicio: ['', Validators.required],
    fecha_fin: ['', Validators.required],
  });
  
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  historial:any; f_inicio:any; f_fin:any; params:any; data_afiliado:any; data_detalle:any; reporte:any; monto_afiliado:any=0
  estados:any=[{id:0, name:'TODOS'},{id:1, name:'ESTÁNDAR'},{id:2, name:'PREMIUM'},]

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.spinner.show()
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let f_inicio:any = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    let f_fin:any = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    let id:any = 0;
    this.f_inicio = f_inicio;
    this.f_fin = f_fin;
    this.formfiltros.controls['fecha_inicio'].setValue(f_inicio)
    this.formfiltros.controls['fecha_fin'].setValue(f_fin)
    this.formfiltros.controls['estados'].setValue(id)
    this.service.getNumberAfiliados(this.f_inicio, this.f_fin).subscribe(resp => {
      if(resp['success']==true){
        this.data_afiliado=resp.cantidad
        this.monto_afiliado=+resp.montos_total
        this.params = `fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}`
        this.listTable()
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

  listTable(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0,'desc'],
      dom: 'Bfrtip',
      buttons: [
        { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Historial Mes'},
        { extend: 'copy', className: 'btn btn-primary text-white', title:'Historial Mes'},
        { extend: 'print', className: 'btn btn-danger text-white', title:'Historial Mes'},
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Historial Mes'}
      ],
      language: HMesComponent.spanish_datatables
    }
    this.service.getHistoryMes(this.params).subscribe(resp => {
      if(resp['success']==true){
        this.historial=resp.data
        this.reporte=resp.reporte
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

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  getfechainicio(){
    let date:any=this.formfiltros.controls.fecha_inicio.value
    const start = new Date((date));
    start.setDate(start.getDate() + 1)
    start.setHours(0, 0, 0, 0);
    this.f_inicio = this.datePipe.transform(start, "yyyy-MM-dd")
    //this.f_inicio = start.getTime() / 1000;
  }

  getfechafin(){
    let date:any=this.formfiltros.controls.fecha_fin.value
    const end = new Date((date));
    end.setDate(end.getDate() + 1)
    end.setHours(23, 59, 59, 999);
    this.f_fin = this.datePipe.transform(end, "yyyy-MM-dd")
    //this.f_fin = end.getTime() / 1000;
  }

  refreshData(){
    this.spinner.show()
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.service.getNumberAfiliados(this.f_inicio, this.f_fin).subscribe(resp => {
        if(resp['success']==true){
          this.data_afiliado=resp.cantidad
          this.params = `fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}`
          this.listTable()
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
    });
  }

  openModalIMG(data){
    this.data_detalle=data
    this.modalRefIMG = this.modalService.open(this.modalContentIMG, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefIMG.result.then();
  }

  closeModalIMG(){
    this.modalRefIMG.close()
  }

  openModalAf(){
    this.modalRefAf = this.modalService.open(this.modalContentAf, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'xl' });
    this.modalRefAf.result.then();
  }

  closeModalAf(){
    this.modalRefAf.close()
  }

  selectTipo(event){
    this.spinner.show()
    try{
      let id= event.id, tipo:any=null
      if(id==1){tipo=false}
      if(id==2){tipo=true}
      this.service.getHistoryMes(this.params).subscribe(resp => {
        if(resp['success']==true){
          if(tipo!=null){
            this.historial = resp.data.filter(hist => hist.data.PREMIUN === tipo);
          }else{
            this.historial=resp.data
          }
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 20,
              lengthMenu: [5, 10, 25],
              processing: true,
              order: [0,'desc'],
              dom: 'Bfrtip',
              buttons: [
                { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Historial Mes'},
                { extend: 'copy', className: 'btn btn-primary text-white', title:'Historial Mes'},
                { extend: 'print', className: 'btn btn-danger text-white', title:'Historial Mes'},
                { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Historial Mes'}
              ],
              language: HMesComponent.spanish_datatables
            }
            this.dtTrigger.next();
            this.spinner.hide()
          });
        }
      })
      // this.historial.forEach(i=>{})
      //this.rerender()
    }catch(e){
      let id:any=0
      this.formfiltros.controls.estados.setValue(id)
      this.service.getHistoryMes(this.params).subscribe(resp => {
        if(resp['success']==true){
          this.historial=resp.data
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtOptions = {
              pagingType: 'full_numbers',
              pageLength: 20,
              lengthMenu: [5, 10, 25],
              processing: true,
              order: [0,'desc'],
              dom: 'Bfrtip',
              buttons: [
                { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Historial Mes'},
                { extend: 'copy', className: 'btn btn-primary text-white', title:'Historial Mes'},
                { extend: 'print', className: 'btn btn-danger text-white', title:'Historial Mes'},
                { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Historial Mes'}
              ],
              language: HMesComponent.spanish_datatables
            }
            this.dtTrigger.next();
            this.spinner.hide()
          });
          this.spinner.hide()
        }        
      });
      //this.rerender()
    }
  }
}
