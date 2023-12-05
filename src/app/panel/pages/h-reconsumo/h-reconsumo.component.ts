import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');
import Swal from "sweetalert2";

@Component({
  selector: 'app-h-reconsumo',
  templateUrl: './h-reconsumo.component.html',
  styleUrls: ['./h-reconsumo.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class HReconsumoComponent implements OnInit {
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
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<HReconsumoComponent>;
  private modalRefIMG: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  @ViewChild('dtActions') dtActions!: TemplateRef<HReconsumoComponent>;

  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<HReconsumoComponent>;

  constructor( private spinner: NgxSpinnerService, private cd: ChangeDetectorRef, private datePipe: DatePipe,
    private service: GeneralService, private modalService: NgbModal) {
    this.columns = [];
  }

  columns: Array<any> = [];

  dtOptions: DataTables.Settings  = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataTableActions: Array<any> = [
    {
      cmd: "detail",
      label: "Ver detalle",
      classList: "btn btn-sm btn-success",
      estado: "PENDIENTE",
      icon: 'fa fa-eye'
    },
    {
      cmd: "update",
      label: "Agregar Articulos",
      classList: "btn btn-sm btn-info",
      estado: "PENDIENTE",
      icon: 'fa fa-edit'
    }
  ];

  public paginate:any; public start_paginate:number=0; register_count:number; fillter_params:any; data_detalle:any; estados:any

  ngOnInit(): void {
    this.listEstados()
    setTimeout(() => {
      this.listar_inventario()
    })
  }

  listEstados(){
    this.service.listEstados().subscribe(resp => {
      if(resp['success']==true){
        this.estados=resp['data']
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
      this.dtTrigger.next();
      this.spinner.hide()
    })
  }

  listar_inventario(): void {
    this.fillter_params = `?pagina=1&cantidad=10`
    this.columns.push(
        {title: 'N°', data:'id' },
        {title: 'CLIENTE', data: 'cliente.id'},
        {title: 'IMPORTE', data: 'importe'},
        {title: 'N° OPERACION', data: 'num_operacion'},
        {title: 'F. PAGO', data: 'created_at'},
        {title: 'ESTADO', data: 'estado.name'},
        {title: 'F. REGISTRO', data: 'created_at'},
    );
    if (this.dataTableActions.length > 0) {
      this.columns.push({
        title: "ACCIONES",
        data: null,
        orderable: false,
        searchable: false,
        defaultContent: "",
        ngTemplateRef: {
          ref: this.dtActions,
          context: {
            captureEvents: this.onCaptureEvent.bind(this)
          }
        }
      });
    }
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        // validar si existe variables en el objeto
        console.log(dataTablesParameters)
        let result = Object.entries(dataTablesParameters).length;
        if (result > 0){
          // si hay registros, configurar los nuevos parametros de busqueda
          //let id= this.formfiltros.controls['estado'].value

          let body_params = dataTablesParameters

          this.start_paginate = body_params['start']

          if (this.register_count){
            if(body_params['length'] > this.register_count){
              this.paginate = 1
            }else{
              let n_paginated = (this.register_count  / body_params['length'])

              n_paginated = Math.round(n_paginated)

              let list_indices:any = [];
              for (let i = 0; i < n_paginated; i++) {
                let i_custom = i + 1
                let value = i * body_params['length'];
                list_indices.push({
                  id: i_custom,
                  value: value,
                });
              }
              list_indices.forEach((item) => {
                if (item.value === body_params['start']) {
                  this.paginate = item.id;
                }
              });
            }
          }else{
            this.paginate = 1
          }
        }
        this.service.getHistoryReconsumo(this.fillter_params).subscribe(resp => {
          let data:any=[]
          resp['data'].forEach(i=>{
            let created_at= this.datePipe.transform(i.created_at,"d MMMM, y")
            let updated_at= this.datePipe.transform(i.updated_at,"d MMMM, y")
            data.push({
              "id": 16,
              "cliente": i.cliente,
              "tipo_venta": i.tipo_venta,
              "estado": i.estado,
              "patrocinador_id": i.patrocinador_id,
              "data": i.data,
              "url_voucher": i.url_voucher,
              "importe": i.importe,
              "num_operacion": i.num_operacion,
              "created_at": created_at,
              "updated_at": updated_at,
              "forma_ganar": i.forma_ganar,
              "pack": i.pack
            })
          })
          this.register_count = resp['cantidad']
          callback({
            recordsTotal: resp['cantidad'],
            recordsFiltered: resp['cantidad'],
            data: data
          });
        })

      },
      rowCallback: (row: Node, data: any[] | object, dataIndex: number) => {
        row.childNodes[0].textContent = String((dataIndex + this.start_paginate) + 1);
      },
      dom: '<l>Bfrtip',
      /*buttons: [
        {
          extend: 'colvis',
          columns: ':not(.noVis)'
        },
        'excel',
      ],*/
      columnDefs: [
        {
          targets: "_all",
          className: "valign-middle",
        },
        {
          targets: [0],
          className: "text-right noVis",
        },
      ],
      stateSave: true,
      serverSide: true,
      processing: true,
      searchDelay: 600,
      language: HReconsumoComponent.spanish_datatables,
      columns: this.columns
    };
    this.cd.detectChanges();
    this.dtTrigger.next();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next()
    });
  }

  onCaptureEvent(event: any): void {
    if (event['cmd'] === 'detail'){
      this.openModalIMG(event.data)
    }else {
      this.cambiarEstado(event.data)
    }
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

  cambiarEstado(data){
    this.data_detalle=data
    var options = {};
    let det=this
    $.map(this.estados,
      function(o) {
        if(o.name!='PENDIENTE'&&o.name!='ENTREGADO'){
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
      if (inputValue.isConfirmed) {
        if(+inputValue.value>0){
          //det.changeEstado(+inputValue.value)
        }        
      }
    });
  }

  // changeEstado(id){
  //   this.spinner.show()
  //   let body={
  //     "registro_id":this.data_detalle.id,
  //     "estado_id":id
  //   }
  //   this.service.aceptarReferidos(body).subscribe(resp => {
  //     if(resp['success']==true){
  //       Swal.fire({
  //         position: "center",
  //         icon: "success",
  //         title: "Estado "+name+' Safisfactoriamente',
  //         showConfirmButton: false,
  //         timer: 1500
  //       });
  //     }
  //   },error => {
  //     if (error.status === 400) {
  //       Swal.fire({
  //         title: 'Error!',
  //         text: error.error['message'],
  //         icon: 'error',
  //         showCancelButton: true,
  //         showConfirmButton: false,
  //         cancelButtonColor: '#d37c0c',
  //         cancelButtonText: 'Cerrar'
  //       })
  //     }
  //     if (error.status === 500) {
  //       Swal.fire({
  //         title: 'Error!',
  //         text: 'Comuniquese con el Area de Sistemas',
  //         icon: 'error',
  //         showCancelButton: true,
  //         showConfirmButton: false,
  //         cancelButtonColor: '#d37c0c',
  //         cancelButtonText: 'Cerrar'
  //       })
  //     }
  //     this.spinner.hide()
  //   })
  // }
}
