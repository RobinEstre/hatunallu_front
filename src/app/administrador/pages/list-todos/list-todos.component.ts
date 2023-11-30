import { Component, OnInit, LOCALE_ID, ViewChild, TemplateRef } from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from '../../services/admin.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, registerLocaleData} from "@angular/common";
import { Subject } from 'rxjs';
import localeEs from '@angular/common/locales/es';
import Swal from "sweetalert2";
import { FormBuilder, Validators } from '@angular/forms';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-list-todos',
  templateUrl: './list-todos.component.html',
  styleUrls: ['./list-todos.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ListTodosComponent implements OnInit {
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
      sortAscending: ": Activar para ordenar la tabla en orden ascendente",
      sortDescending: ": Activar para ordenar la tabla en orden descendente"
    }
  }
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<ListTodosComponent>;
  private modalRefIMG: NgbModalRef;
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  constructor(private service: AdminService,private spinner: NgxSpinnerService,private fb: FormBuilder,private modalService: NgbModal) { }
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  formfiltros = this.fb.group({
    estados: [null, Validators.required],
  });

  clientes:any; estados:any; data_detalle:any

  ngOnInit(): void {
    this.spinner.show()
    this.listEstados()
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listEstados(){
    this.service.listEstados().subscribe(resp => {
      if(resp['success']==true){
        this.estados=resp['data']
        let id:any=1
        this.formfiltros.controls.estados.setValue(id)
        this.list(id)
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
      this.clientes=[]
      this.dtTrigger.next();
      this.spinner.hide()
    })
  }

  list(estado){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [5, 10, 25],
      processing: true,
      dom: 'Bfrtip',
      buttons: [
        { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Reporte Clientes'},
        { extend: 'copy', className: 'btn btn-primary text-white', title:'Reporte Clientes'},
        { extend: 'print', className: 'btn btn-danger text-white', title:'Reporte Clientes'},
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Reporte Clientes'},
        { extend: 'colvis', className: 'btn btn-warning'},
      ],
      language: ListTodosComponent.spanish_datatables
    }
    this.service.listClientes(estado).subscribe(resp => {
      if(resp['success']==true){
        this.clientes=resp['data']
        this.dtTrigger.next();
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
      this.clientes=[]
      this.dtTrigger.next();
      this.spinner.hide()
    })
  }

  selectEstado(event){
    this.spinner.show()
    try{
      let id= event.id
      this.actTable(id)
    }catch(e){
      let id:any=1
      this.formfiltros.controls.estados.setValue(id)
      this.actTable(id)
    }
  }

  actTable(id){
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.list(id)
    });
  }

  cambiarEstado(data){
    this.data_detalle=data
    var options = {};
    let det=this
    $.map(this.estados,
      function(o) {
        if(o.name!='PENDIENTE'){
          options[o.id] = o.name;
        }
    });

    Swal.fire({
      title: 'Cliente: '+data.data_referido.nombre+' '+data.data_referido.apellido,
      text: 'Aprobar o Anular',
      input: 'select',
      inputOptions: options,
      showCancelButton: true,
      inputPlaceholder: 'Seleccionar Opción'
    }).then(function (inputValue) {
      if (inputValue) {
        det.changeEstado(+inputValue.value)
      }
    });
  }

  changeEstado(id){
    this.spinner.show()
    let body={
      "registro_id":this.data_detalle.id,
      "estado_id":id
    }
    this.service.aceptarReferidos(body).subscribe(resp => {
      if(resp['success']==true){
        let name
        this.estados.forEach(i=>{
          if(i.id==id){name=i.name}
        })
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Estado "+name+' Safisfactoriamente',
          showConfirmButton: false,
          timer: 1500
        });
        let id_estado= this.formfiltros.controls.estados.value
        this.actTable(id_estado)
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

  openModalIMG(data){
    this.data_detalle=data
    this.modalRefIMG = this.modalService.open(this.modalContentIMG, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'lg' });
    this.modalRefIMG.result.then();
  }

  closeModalIMG(){
    this.modalRefIMG.close()
  }
}
