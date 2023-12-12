import { Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {Subject} from "rxjs";
import localeEs from '@angular/common/locales/es';
import Swal from "sweetalert2";
import { GeneralService } from '../../services/general.service';
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
  
  constructor(private spinner: NgxSpinnerService, private service: GeneralService) { }
  
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  comisiones:any; total_ganancia:any=0

  ngOnInit(): void {
    this.listInit()
  }

  listInit(){
    this.spinner.show()
    this.service.getProfile().subscribe(resp => {
      if(resp['success']==true){
        this.listTable(resp.data_usuario.persona)
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

  listTable(id){
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
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Comisiones Historial'},
        { extend: 'colvis', className: 'btn btn-warning'},
      ],
      language: ComisionesComponent.spanish_datatables
    }
    this.service.getComisiones(id).subscribe(resp => {
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
              "ganancias": i.ganancias,
            })
          }
        })
        this.comisiones=data
        this.total_ganancia=resp['ganancia_total']
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
}
