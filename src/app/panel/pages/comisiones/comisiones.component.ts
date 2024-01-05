import { Component, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {Subject} from "rxjs";
import localeEs from '@angular/common/locales/es';
import Swal from "sweetalert2";
import { GeneralService } from '../../services/general.service';
import { FormBuilder, Validators } from '@angular/forms';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-comisiones',
  templateUrl: './comisiones.component.html',
  styleUrls: ['./comisiones.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ComisionesComponent implements OnInit {
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
  
  constructor(private spinner: NgxSpinnerService, private service: GeneralService, private datePipe: DatePipe, private fb: FormBuilder,) { }

  formfiltros = this.fb.group({
    fecha_inicio: ['', Validators.required],
    fecha_fin: ['', Validators.required],
  });
  
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  comisiones:any; total_ganancia:any=0;
  @Input() f_inicio:any; @Input() f_fin:any; @Input() id_user:any; params:any;

  ngOnInit(): void {
    console.log(this.f_inicio)
    console.log(this.f_fin)
    this.first_and_last_date_month()
    //this.listInit()
  }

  listInit(){
    this.spinner.show()
    this.service.getProfile().subscribe(resp => {
      if(resp['success']==true){
        this.id_user=resp.data_usuario.persona
        this.first_and_last_date_month()
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

  // first_and_last_date_month(){
  //   var date = new Date();
  //   var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  //   var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  //   let f_inicio:any = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
  //   let f_fin:any = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
  //   this.f_inicio = firstDay.getTime() / 1000;
  //   this.f_fin = lastDay.getTime() / 1000;
  //   this.formfiltros.controls['fecha_inicio'].setValue(f_inicio)
  //   this.formfiltros.controls['fecha_fin'].setValue(f_fin)
  //   this.params = `fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}`
  //   this.listTable()
  // }

  first_and_last_date_month(){
    let start = new Date(this.f_inicio);
    let end = new Date(this.f_fin);
    let f_inicio = start.getTime() / 1000;
    let f_fin = end.getTime() / 1000;
    this.params = `fecha_inicio=${f_inicio}&fecha_fin=${f_fin}`
    this.listTable()
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
        { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Comisiones Historial'},
        { extend: 'copy', className: 'btn btn-primary text-white', title:'Comisiones Historial'},
        { extend: 'print', className: 'btn btn-danger text-white', title:'Comisiones Historial'},
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Comisiones Historial'}
      ],
      language: ComisionesComponent.spanish_datatables
    }
    this.service.getComisiones2(this.id_user, this.params).subscribe(resp => {
      if(resp['success']==true){
        let data:any=[]
        resp.data.forEach(i=>{
          if(i.nivel!=0){
            data.push({
              "nombre": i.nombre,
              "hijo_id": i.hijo_id,
              "apellido": i.apellido,
              "nivel": i.nivel,
              "padre_id": i.padre_id,
              "importe": i.importe,
              "cantidad_products": i.cantidad_products,
              "ganancias": i.ganancia,
              "pack_name": i.pack_name,
            })
          }
        })
        this.comisiones=data
        this.total_ganancia=+resp['ganancia_total']
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
    //console.log(date)
    const start = new Date(date);
    start.setDate(start.getDate() + 1)
    start.setHours(0, 0, 0, 0);
    let inicio:any = this.datePipe.transform(start, "yyyy-MM-dd")
    this.f_inicio = start.getTime() / 1000;
    console.log(this.f_inicio)
    console.log(inicio)
  }

  getfechafin(){
    let date:any=this.formfiltros.controls.fecha_fin.value
    const end = new Date((date));
    end.setDate(end.getDate() + 1)
    end.setHours(23, 59, 59, 999);
    let fin = this.datePipe.transform(end, "yyyy-MM-dd")
    this.f_fin = end.getTime() / 1000;
  }

  refreshData(){
    this.spinner.show()
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.params = `fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}`
      this.listTable()
    });
  }
}
