import { Component, OnInit, LOCALE_ID, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import {DataTableDirective} from "angular-datatables";
import { NgxSpinnerService } from 'ngx-spinner';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe, registerLocaleData} from "@angular/common";
import { Subject } from 'rxjs';
import localeEs from '@angular/common/locales/es';
import Swal from "sweetalert2";
import { FormBuilder, Validators } from '@angular/forms';
import { AlmacenService } from '../../services/almacen.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ProductosComponent implements OnInit {
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
  @ViewChild('modal_estado') private modalContentEstado: TemplateRef<ProductosComponent>;
  private modalRefEstado: NgbModalRef;
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<ProductosComponent>;
  private modalRefIMG: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  @ViewChild('dtActions') dtActions!: TemplateRef<ProductosComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<ProductosComponent>;
  @ViewChild('is_estado') is_estado!: TemplateRef<ProductosComponent>;

  constructor(private service: AlmacenService,private spinner: NgxSpinnerService, private fb: FormBuilder,private modalService: NgbModal, 
    private cd: ChangeDetectorRef, private datePipe: DatePipe,) { 
  }

  formfiltros = this.fb.group({
    estados: [null, Validators.required],
  });

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
      estado: "APROBADO",
      icon: 'fa fa-edit'
    }
  ];

  public paginate:any; public start_paginate:number=0; register_count:number; fillter_params:any; data_detalle:any; estados:any;
  productos:any; data_productos:any=[]; total_cantidad:any=0; validar_entrega:boolean=false

  ngOnInit(): void {
    this.listEstados()
    setTimeout(() => {
      this.listarData()
    })
  }

  ngAfterViewInit(): void {
    //this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  listEstados(){
    this.spinner.show()
    this.service.listEstados().subscribe(resp => {
      if(resp['success']==true){
        this.estados=resp['data']
        let id:any=2
        this.formfiltros.controls.estados.setValue(id)
        this.fillter_params = `?pagina=1&cantidad=10&estado_id=2`
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
    this.service.getProductos().subscribe(resp=>{
      if(resp.success){
        this.productos=resp.data
        this.spinner.hide();
      }
    })
  }

  listarData(): void {
    this.columns.push(
        {title: 'N°', data:'id' },
        {title: 'CLIENTE', data: 'cliente_name'},
        {title: 'DOCUMENTO', data: 'data_referido.dni'},
        {title: 'CELULAR', data: 'data_referido.telefono'},
        {title: 'CORREO', data: 'data_referido.email'},
        {title: 'PACK', data: 'pack.name'},
        {title: 'BANCO', data: 'banco.name'},
        {title: 'N° OPERACION', data: 'numero_operacion'},
        {title: 'IMPORTE', data: 'importe'},
        {title: 'F. PAGO', data: 'fecha_pago'},
        {title: 'PATROCINADOR', data: 'patrocinador_name'},
        // { title: 'ESTADO',
        //   data: 'estado',
        //   defaultContent: '',
        //   orderable: false,
        //   searchable: false,
        //   ngTemplateRef: {
        //     ref: this.is_estado,
        //     context: {
        //       // needed for capturing events inside <ng-template>
        //       captureEvents: this.captureEventsEmitido.bind(self)
        //     }
        //   }
        // },
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
          let id=2
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
          if(this.formfiltros.controls.estados.value!=null){id=this.formfiltros.controls.estados.value}
          this.fillter_params = `?pagina=${this.paginate}&cantidad=${body_params['length']}&estado_id=${id}&nombre_referido=${body_params['search']['value']}`
        }
        this.service.getListReferidos(this.fillter_params).subscribe(resp => {
          let data:any=[]
          resp['data'].forEach(i=>{
            let created_at= this.datePipe.transform(i.created_at,"dd-MM-yyyy")
            let updated_at= this.datePipe.transform(i.updated_at,"dd-MM-yyyy")
            let fecha_pago= this.datePipe.transform(i.fecha_pago,"dd-MM-yyyy")
            let cliente_name=i.data_referido.nombre+' '+i.data_referido.apellido
            let patrocinador_name=i.patrocinador.nombre+' '+i.patrocinador.apellido
            data.push({
              "id": i.id,
              "estado": i.estado,
              "banco": i.banco,
              "pack": i.pack,
              "patrocinador": i.patrocinador,
              "data_referido": i.data_referido,
              "numero_operacion": i.numero_operacion,
              "url_comprobante": i.url_comprobante,
              "importe": i.importe,
              "created_at": created_at,
              "updated_at": updated_at,
              "fecha_pago": fecha_pago,
              cliente_name: cliente_name,
              patrocinador_name: patrocinador_name
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
      language: ProductosComponent.spanish_datatables,
      columns: this.columns
    };
    this.cd.detectChanges();
    this.dtTrigger.next();
  }

  captureEventsEmitido(event: any): void {
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
      this.openModalEstado(event.data)
    }
  }

  selectEstado(event){
    try{
      let id= event.id
      this.rerender()
    }catch(e){
      let id:any=2
      this.formfiltros.controls.estados.setValue(id)
      this.rerender()
    }
  }

  cambiarEstado(data){
    this.data_detalle=data
    Swal.fire({
      title: "Estas seguro de validar la entrega?",
      text: "Si validas no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, validar!",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.changeEstado(4)
      }
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

  openModalEstado(data){
    this.data_detalle=data
    this.data_productos=[]
    this.total_cantidad=0
    this.validar_entrega=false
    this.modalRefEstado = this.modalService.open(this.modalContentEstado, {backdrop : 'static', centered: true, keyboard: false,
      windowClass: 'animate__animated animate__backInUp', size: 'md' });
    this.modalRefEstado.result.then();
  }

  closeModalEstado(){
    this.modalRefEstado.close()
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
      let cantidad:any=0
      this.data_productos.forEach(i=>{
        cantidad += i.cantidad
      })
      this.total_cantidad=cantidad
      if(cantidad>this.data_detalle.pack.cantidad_productos){
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "No se puede superar la cantidad a entregar",
          showConfirmButton: false,
          timer: 2500
        });
        this.productos.forEach(i=>{
          let id= i.id
          let elemento :any = document.getElementById(id);
          elemento.value = 0;
        })
        this.total_cantidad=0
        this.validar_entrega=false
        this.data_productos=[]
      }
      if(cantidad==this.data_detalle.pack.cantidad_productos){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cantidad de productos listos a entregar",
          showConfirmButton: false,
          timer: 2500
        });
        this.validar_entrega=true
      }
    }else{
      this.total_cantidad=0
    }
  }

  actEstado(){
    Swal.fire({
      title: "Estas seguro de validar la entrega?",
      text: "Si validas no se podrá revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, validar!",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.closeModalEstado()
        this.changeEstado(4)
      }
    });
  }

  changeEstado(id){
    this.spinner.show()
    let productos:any=[], total:any=0
    this.data_productos.forEach(i=>{
      productos.push({
        "producto_id":i.id,
        "cantidad": i.cantidad
      })
      total += +i.cantidad
    })
    let body={
      "total_productos": total,
      "productos": productos
      // "registro_id":this.data_detalle.id,
      // "estado_id":id
    }
    this.service.entregaProductos(this.data_detalle.id, body).subscribe(resp => {
      if(resp['success']==true){
        let name
        this.estados.forEach(i=>{
          if(i.id==id){name=i.name}
        })
        this.spinner.hide()
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Producto "+name+' Safisfactoriamente',
          showConfirmButton: false,
          timer: 2500
        });
        this.rerender()
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
}
