import { ChangeDetectorRef, Component, Input, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import Swal from "sweetalert2";
import {Subject} from "rxjs";
import localeEs from '@angular/common/locales/es';
import { DataTableDirective } from 'angular-datatables';
import {DatePipe, registerLocaleData} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import { AdminService } from '../../../services/admin.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-afiliados',
  templateUrl: './afiliados.component.html',
  styleUrls: ['./afiliados.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class AfiliadosComponent implements OnInit {
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

  @ViewChild('dtActions') dtActions!: TemplateRef<AfiliadosComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<AfiliadosComponent>;
  @ViewChild('is_estado') is_estado!: TemplateRef<AfiliadosComponent>;

  constructor(private spinner: NgxSpinnerService, private service: AdminService, private datePipe: DatePipe,private cd: ChangeDetectorRef,) {
    this.columns = [];
  }

  @Input() inicio: any; @Input() fin: any;

  columns: Array<any> = [];

  dtOptions: DataTables.Settings  = {};
  dtTrigger: Subject<any> = new Subject<any>();
  dataTableActions: Array<any> = [
    {
      cmd: "detail",
      label: "Ver detalle",
      classList: "btn btn-sm btn-success",
      estado: "TODOS",
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

  afiliados:any; public paginate:any; public start_paginate:number=0; register_count:number; fillter_params:any

  ngOnInit(): void {
    setTimeout(() => {
      this.listInit()
    })
  }

  listInit(){
    this.spinner.show()
    this.columns.push(
        {title: 'N°', data:'id' },
        {title: 'CLIENTE', data: 'cliente_name'},
        {title: 'IMPORTE', data: 'importe'},
        {title: 'N° OPERACION', data: 'num_operacion'},
        {title: 'F. PAGO', data: 'fecha_pago'},
        { title: 'ESTADO',
          data: 'estado',
          defaultContent: '',
          orderable: false,
          searchable: false,
          ngTemplateRef: {
            ref: this.is_estado,
            context: {
              // needed for capturing events inside <ng-template>
              captureEvents: this.captureEventsEmitido.bind(self)
            }
          }
        },
        {title: 'F. REGISTRO', data: 'created_at'},
    );
    // if (this.dataTableActions.length > 0) {
    //   this.columns.push({
    //     title: "ACCIONES",
    //     data: null,
    //     orderable: false,
    //     searchable: false,
    //     defaultContent: "",
    //     ngTemplateRef: {
    //       ref: this.dtActions,
    //       context: {
    //         captureEvents: this.onCaptureEvent.bind(this)
    //       }
    //     }
    //   });
    // }
    this.dtOptions = {
      ajax: (dataTablesParameters: any, callback) => {
        // validar si existe variables en el objeto
        console.log(dataTablesParameters)
        let result = Object.entries(dataTablesParameters).length;
        if (result > 0){
          let id=1
          let body_params = dataTablesParameters
          this.start_paginate = body_params['start']
          if (this.register_count){
            if (body_params['length'] > this.register_count){
              this.paginate = 1
            }else{
              let n_paginated = (this.register_count  / body_params['length'])
              console.log(n_paginated)
              if (Number.isInteger(this.register_count  / body_params['length'])) {
                n_paginated = Math.round(n_paginated)
              }else {
                n_paginated = Math.round(n_paginated) + 1
              }
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
          }else {
            this.paginate = 1
          }
          this.fillter_params = `?pagina=${this.paginate}&cantidad=${body_params['length']}&tipo_venta_id=1
          &cliente_name=${body_params['search']['value']}&fecha_inicio=${this.inicio}&fecha_fin=${this.fin}`
        }
        this.service.getHistoryReconsumo(this.fillter_params).subscribe(resp => {
          let data:any=[]
          resp['data'].forEach(i=>{
            let cliente_name=i.cliente.nombre+' '+i.cliente.apellido
            let created_at= this.datePipe.transform(i.created_at,"d MMMM, y")
            let updated_at= this.datePipe.transform(i.updated_at,"d MMMM, y")
            let fecha_pago= this.datePipe.transform(i.fecha_pago,"d MMMM, y")
            data.push({
              "id": i.id,
              "cliente": i.cliente,
              "tipo_venta": i.tipo_venta,
              "estado": i.estado,
              "patrocinador_id": i.patrocinador_id,
              "data": i.data,
              "url_voucher": i.url_voucher,
              "importe": i.importe,
              "monto_neto": i.monto_neto,
              "num_operacion": i.num_operacion,
              "created_at": created_at,
              "updated_at": updated_at,
              "fecha_pago": fecha_pago,
              "forma_ganar": i.forma_ganar,
              "pack": i.pack,
              cliente_name: cliente_name,
            })
          })
          this.register_count = resp['cantidad']
          callback({
            recordsTotal: resp['cantidad'],
            recordsFiltered: resp['cantidad'],
            data: data
          });
          this.spinner.hide()
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
      language: AfiliadosComponent.spanish_datatables,
      columns: this.columns
    };
    this.cd.detectChanges();
    this.dtTrigger.next();
    this.service.getNumberAfiliados(this.inicio, this.fin).subscribe(resp => {
      if(resp['success']==true){
        this.afiliados=resp.data
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

  captureEventsEmitido(event: any): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
