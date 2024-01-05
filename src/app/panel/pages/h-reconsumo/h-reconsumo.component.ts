import { ChangeDetectorRef, Component, Input, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');
import Swal from "sweetalert2";
import { FormBuilder, Validators } from '@angular/forms';

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
  @ViewChild('is_estado') is_estado!: TemplateRef<HReconsumoComponent>;

  constructor( private spinner: NgxSpinnerService, private cd: ChangeDetectorRef, private datePipe: DatePipe,
    private service: GeneralService, private modalService: NgbModal,private fb: FormBuilder) {
    //this.columns = [];
  }

  formfiltros = this.fb.group({
    estados: [null, Validators.required],
    fecha_inicio: ['', Validators.required],
    fecha_fin: ['', Validators.required],
  });

  // columns: Array<any> = [];

  // dtOptions: DataTables.Settings  = {};
  // dtTrigger: Subject<any> = new Subject<any>();
  // dataTableActions: Array<any> = [
  //   {
  //     cmd: "detail",
  //     label: "Ver detalle",
  //     classList: "btn btn-sm btn-success",
  //     estado: "PENDIENTE",
  //     icon: 'fa fa-eye'
  //   },
  //   // {
  //   //   cmd: "update",
  //   //   label: "Agregar Articulos",
  //   //   classList: "btn btn-sm btn-info",
  //   //   estado: "PENDIENTE",
  //   //   icon: 'fa fa-edit'
  //   // }
  // ];
  
  dtOptions: any;
  dtTrigger: Subject<any> = new Subject<any>();

  //public paginate:any; public start_paginate:number=0; register_count:number; fillter_params:any; 
  data_detalle:any; estados:any; data_user:any; reconsumos:any; total_ganancia:any
  @Input() f_inicio:any; @Input() f_fin:any; @Input() id_user:any; 

  ngOnInit(): void {
    this.listarData()
    //this.listEstados()
  }

  listEstados(){
    this.spinner.show()
    this.service.listEstados().subscribe(resp => {
      if(resp['success']==true){
        this.estados=resp['data']
        let id:any=1
        this.formfiltros.controls.estados.setValue(id)
        //this.fillter_params = `?pagina=1&cantidad=10&estado_id=1`
        this.service.getProfile().subscribe(resp=>{
          if(resp.success){
            this.data_user=resp.data_usuario;
            this.first_and_last_date_month()
          }
        })
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

  first_and_last_date_month(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let f_inicio:any = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    let f_fin:any = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    this.f_inicio = f_inicio;
    this.f_fin = f_fin;
    this.formfiltros.controls['fecha_inicio'].setValue(f_inicio)
    this.formfiltros.controls['fecha_fin'].setValue(f_fin)
    this.listarData()
  }

  listarData(): void {
    this.spinner.show()
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [5, 10, 25],
      processing: true,
      order: [0,'desc'],
      dom: 'Bfrtip',
      buttons: [
        { extend: 'pdfHtml5', className: 'btn btn-primary text-white', title:'Comisiones Reconsumos'},
        { extend: 'copy', className: 'btn btn-primary text-white', title:'Comisiones Reconsumos'},
        { extend: 'print', className: 'btn btn-danger text-white', title:'Comisiones Reconsumos'},
        { extend: 'excelHtml5', className: 'btn btn-success text-white', title:'Comisiones Reconsumos'}
      ],
      language: HReconsumoComponent.spanish_datatables
    }
    let data={
      id: this.id_user,
      inicio: this.f_inicio,
      fin: this.f_fin
    }
    this.service.getComisionesReconsumo(data).subscribe(resp => {
      if(resp['success']==true){
        let total=0
        this.reconsumos=resp.cantidad_puntos
        resp.cantidad_puntos.forEach(i=>{
          total += i.ganancia
        })
        this.total_ganancia=total
        this.spinner.hide()
        this.dtTrigger.next();
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
    // this.service.getProfile().subscribe(resp=>{
    //   if(resp.success){
    //     this.data_user=resp.data_usuario;
    //     this.columns.push(
    //         {title: 'N°', data:'id' },
    //         {title: 'CLIENTE', data: 'cliente_name'},
    //         {title: 'IMPORTE', data: 'monto_neto'},
    //         {title: 'N° OPERACION', data: 'num_operacion'},
    //         {title: 'F. PAGO', data: 'created_at'},
    //         { title: 'ESTADO',
    //           data: 'estado',
    //           defaultContent: '',
    //           orderable: false,
    //           searchable: false,
    //           ngTemplateRef: {
    //             ref: this.is_estado,
    //             context: {
    //               // needed for capturing events inside <ng-template>
    //               captureEvents: this.captureEventsEmitido.bind(self)
    //             }
    //           }
    //         },
    //         {title: 'F. REGISTRO', data: 'created_at'},
    //     );
    //     if (this.dataTableActions.length > 0) {
    //       this.columns.push({
    //         title: "ACCIONES",
    //         data: null,
    //         orderable: false,
    //         searchable: false,
    //         defaultContent: "",
    //         ngTemplateRef: {
    //           ref: this.dtActions,
    //           context: {
    //             captureEvents: this.onCaptureEvent.bind(this)
    //           }
    //         }
    //       });
    //     }
    //     this.dtOptions = {
    //       ajax: (dataTablesParameters: any, callback) => {
    //         // validar si existe variables en el objeto
    //         console.log(dataTablesParameters)
    //         let result = Object.entries(dataTablesParameters).length;
    //         if (result > 0){
    //           let id=1
    //           let body_params = dataTablesParameters
    //           this.start_paginate = body_params['start']
    //           if (this.register_count){
    //             if (body_params['length'] > this.register_count){
    //               this.paginate = 1
    //             }else{
    //               let n_paginated = (this.register_count  / body_params['length'])
    //               console.log(n_paginated)
    //               if (Number.isInteger(this.register_count  / body_params['length'])) {
    //                 n_paginated = Math.round(n_paginated)
    //               }else {
    //                 n_paginated = Math.round(n_paginated) + 1
    //               }
    //               let list_indices:any = [];
    //               for (let i = 0; i < n_paginated; i++) {
    //                 let i_custom = i + 1
    //                 let value = i * body_params['length'];
    //                 list_indices.push({
    //                   id: i_custom,
    //                   value: value,
    //                 });
    //               }
    //               list_indices.forEach((item) => {
    //                 if (item.value === body_params['start']) {
    //                   this.paginate = item.id;
    //                 }
    //               });
    //             }
    //           }else {
    //             this.paginate = 1
    //           }
    //           if(this.formfiltros.controls.estados.value!=null){id=this.formfiltros.controls.estados.value}
    //           this.fillter_params = `?pagina=${this.paginate}&cantidad=${body_params['length']}&estado_id=${id}
    //             &tipo_venta_id=2&usuario_id=${this.data_user.persona}&cliente_name=${body_params['search']['value']}`
    //         }
    //         this.service.getHistoryReconsumo(this.fillter_params).subscribe(resp => {
    //           let data:any=[]
    //           resp['data'].forEach(i=>{
    //             let created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy")
    //             let updated_at= this.datePipe.transform(i.updated_at,"dd/MM/yyyy")
    //             let nombre= i.cliente.nombre + ' ' + i.cliente.apellido
    //             data.push({
    //               "id": 16,
    //               "cliente": i.cliente,
    //               "cliente_name": nombre,
    //               "tipo_venta": i.tipo_venta,
    //               "estado": i.estado,
    //               "patrocinador_id": i.patrocinador_id,
    //               "data": i.data,
    //               "url_voucher": i.url_voucher,
    //               "importe": i.importe,
    //               "monto_neto": i.monto_neto,
    //               "num_operacion": i.num_operacion,
    //               "created_at": created_at,
    //               "updated_at": updated_at,
    //               "forma_ganar": i.forma_ganar,
    //               "pack": i.pack
    //             })
    //           })
    //           this.register_count = resp['cantidad']
    //           callback({
    //             recordsTotal: resp['cantidad'],
    //             recordsFiltered: resp['cantidad'],
    //             data: data
    //           });
    //         })
    
    //       },
    //       rowCallback: (row: Node, data: any[] | object, dataIndex: number) => {
    //         row.childNodes[0].textContent = String((dataIndex + this.start_paginate) + 1);
    //       },
    //       dom: '<l>Bfrtip',
    //       /*buttons: [
    //         {
    //           extend: 'colvis',
    //           columns: ':not(.noVis)'
    //         },
    //         'excel',
    //       ],*/
    //       columnDefs: [
    //         {
    //           targets: "_all",
    //           className: "valign-middle",
    //         },
    //         {
    //           targets: [0],
    //           className: "text-right noVis",
    //         },
    //       ],
    //       stateSave: true,
    //       serverSide: true,
    //       processing: true,
    //       searchDelay: 600,
    //       language: HReconsumoComponent.spanish_datatables,
    //       columns: this.columns
    //     };
    //     this.cd.detectChanges();
    //     this.dtTrigger.next();
    //   }
    // })
  }

  captureEventsEmitido(event: any): void {
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.spinner.show()
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.listarData()
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
      title: 'Cliente: '+data.cliente.id+' '+data.cliente.id,
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

  selectEstado(event){
    try{
      let id= event.id
      this.rerender()
    }catch(e){
      let id:any=1
      this.formfiltros.controls.estados.setValue(id)
      this.rerender()
    }
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
