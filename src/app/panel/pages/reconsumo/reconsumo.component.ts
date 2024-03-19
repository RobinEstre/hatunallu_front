import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-reconsumo',
  templateUrl: './reconsumo.component.html',
  styleUrls: ['./reconsumo.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class ReconsumoComponent implements OnInit {
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
  @ViewChild('modal_img') private modalContentIMG: TemplateRef<ReconsumoComponent>;
  private modalRefIMG: NgbModalRef;

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  @ViewChild('dtActions') dtActions!: TemplateRef<ReconsumoComponent>;
  @ViewChild('idTpl', {static: true}) idTpl: TemplateRef<ReconsumoComponent>;
  @ViewChild('is_estado') is_estado!: TemplateRef<ReconsumoComponent>;

  constructor(private fb: FormBuilder, private spinner: NgxSpinnerService,private service: GeneralService, 
    private cd: ChangeDetectorRef, private datePipe: DatePipe, private modalService: NgbModal) { }

  formPass = this.fb.group({
    banco: [null, Validators.required],
    operacion: [null, Validators.required],
    fecha: [null, Validators.required]
  });

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
      estado: "PENDIENTE",
      icon: 'fa fa-eye'
    },
    // {
    //   cmd: "update",
    //   label: "Agregar Articulos",
    //   classList: "btn btn-sm btn-info",
    //   estado: "PENDIENTE",
    //   icon: 'fa fa-edit'
    // }
  ];

  productos:any; banco:any; data_productos:any=[]; total_precio:any=0; files: any[] = []; data_user:any
  public f_inicio:any; public f_fin:any
  public paginate:any; public start_paginate:number=0; register_count:number; fillter_params:any; data_detalle:any; estados:any

  ngOnInit(): void {
    this.list()
    setTimeout(() => {
      this.listar_Data()
    })
  }

  list(){
    this.spinner.show();
    this.service.getProductos().subscribe(resp=>{
      if(resp.success){
        this.productos=resp.data
        this.spinner.hide();
      }
    })
    this.service.getBancos().subscribe(resp=>{
      if(resp.success){
        this.banco=resp.data
      }
    })
    this.service.listEstados().subscribe(resp => {
      if(resp['success']==true){
        this.estados=resp['data']
        let id:any=1
        this.formfiltros.controls.estados.setValue(id)
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.f_inicio = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
        this.f_fin = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
        this.fillter_params = `?pagina=1&cantidad=10&estado_id=1&fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}`
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
    this.service.getProfile().subscribe(resp=>{
      if(resp.success){
        this.data_user=resp.data_usuario;
      }
    })
  }

  first_and_last_date_month(){
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let f_inicio = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    let f_fin = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    this.f_inicio = firstDay.getTime() / 1000;
    this.f_fin = lastDay.getTime() / 1000;
    this.formfiltros.controls['fecha_inicio'].setValue(f_inicio)
    this.formfiltros.controls['fecha_fin'].setValue(f_fin)
  }

  listar_Data(): void {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.f_inicio = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    this.f_fin = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    this.service.getProfile().subscribe(resp=>{
      if(resp.success){
        this.data_user=resp.data_usuario;
        this.columns.push(
            {title: 'N°', data:'id' },
            {title: 'CLIENTE', data: 'cliente_name'},
            {title: 'IMPORTE', data: 'monto_neto'},
            {title: 'N° OPERACION', data: 'num_operacion'},
            {title: 'F. PAGO', data: 'created_at'},
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
              if(this.formfiltros.controls.estados.value!=null){id=this.formfiltros.controls.estados.value}
              this.fillter_params = `?pagina=${this.paginate}&cantidad=${body_params['length']}&estado_id=${id}&tipo_venta_id=2&usuario_id=${this.data_user.persona}&fecha_inicio=${this.f_inicio}&fecha_fin=${this.f_fin}&cliente_name=${body_params['search']['value']}`
            }
            this.service.getHistoryReconsumo(this.fillter_params).subscribe(resp => {
              let data:any=[]
              resp['data'].forEach(i=>{
                let created_at= this.datePipe.transform(i.created_at,"dd/MM/yyyy")
                let updated_at= this.datePipe.transform(i.updated_at,"dd/MM/yyyy")
                let nombre= i.cliente.nombre + ' ' + i.cliente.apellido
                data.push({
                  "id": 16,
                  "cliente": i.cliente,
                  "cliente_name": nombre,
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
          language: ReconsumoComponent.spanish_datatables,
          columns: this.columns
        };
        this.cd.detectChanges();
        this.dtTrigger.next();
      }
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
      //this.cambiarEstado(event.data)
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

  onSelect(event) {
    //console.log(event.target.files)
    this.files=[]
    this.files.push(event.target.files);
    console.log(this.files)
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
      let total:any=0, cantidad:any=0
      this.data_productos.forEach(i=>{
        total += i.total
        cantidad += i.cantidad
      })
      if(cantidad>=6){
        let descuento:any=0, num=0
        this.data_productos.forEach(i=>{
          if(this.data_productos[num].precio==80){descuento=60}
          num++
        })
        if(this.data_productos[0].precio==90){descuento=80}
        if(this.data_productos[0].precio==100){descuento=100}
        if(this.data_productos[0].precio==110){descuento=120}
        if(this.data_productos[0].precio==120){descuento=140}
        if(this.data_productos[0].precio==130){descuento=160}
        this.total_precio=total-descuento
      }else{
        this.total_precio=total
      }
    }else{
      this.total_precio=0
    }
  }

  subirIMG(){
    this.spinner.show()
    for(let a=0; a<this.files.length; a++){
      const formData = new FormData()
      formData.append("bucket", 'jatun-files');
      formData.append("nombre", this.files[a].name);
      formData.append("folder", 'vouchers-reconsumo/');
      formData.append('files', this.files[a][a], this.files[a][a].name);

      this.service.subirIMG(formData).subscribe(data => {
        if(data['success']==true){
          let url= data['data'][0]['url']
          this.registrarReconsumo(url)
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

  registrarReconsumo(url){
    let productos:any=[], total:any=0
    this.data_productos.forEach(i=>{
      productos.push({
        "producto_id":i.id,
        "cantidad": i.cantidad
      })
      total += +i.cantidad
    })
    let body={
      "num_operacion": this.formPass.controls.operacion.value,
      "url_voucher": url,
      "banco_id": this.formPass.controls.banco.value,
      "fecha_pago": this.formPass.controls.fecha.value,
      "total_productos": total,
      "productos": productos
    }
    this.service.registerReconsumo(body).subscribe(resp=>{
      if(resp.success){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registrado Correctamente Esperar la Validación",
          showConfirmButton: false,
          timer: 2500
        });
        this.files=[]
        this.formPass.reset()
        this.total_precio=0
        this.data_productos=[]
        this.productos.forEach(i=>{
          let id= i.id
          let elemento :any = document.getElementById(id);
          elemento.value = 0;
        })
        this.rerender()
        this.spinner.hide()
      }
    }, error => {
      this.spinner.hide()
      if (error.status === 500){
        Swal.fire({
          title: 'Oops!',
          text: 'Ocurrio un incidente en el servidor, contactate con el area de sistemas',
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar ventana'
        })
      }else if (error.status === 400){
        Swal.fire({
          title: 'Oops!',
          text: error.error.message,
          icon: 'error',
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: '#c02c2c',
          cancelButtonText: 'Cerrar ventana'
        })
      }
    })
  }
}
