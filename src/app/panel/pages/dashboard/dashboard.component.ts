import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/shared/services/panel.service';
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
import Swal from 'sweetalert2';
import { AdminService } from 'src/app/administrador/services/admin.service';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class DashboardComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private generalService: GeneralService, public navServices: NavService,private router: Router,
    private servicePanel: PanelService, private datePipe: DatePipe, private adminService: AdminService) { }
  
  menuItems: any[] = []; group_name:any; rango:any; days:any; comisiones:any; profile: any; data_afiliado:any; reporte:any

  ngOnInit(): void {
    this.generalService.listGrupos().subscribe(resp => {
      let name = null
      resp['grupos'].forEach(i=>{
        name = i
      })
      console.log(name)
      if(name=='AFILIADO'){this.listGroup()}
      else{this.listAdmin()}
      if(name){
        localStorage.setItem('group_name', name)
        this.navServices.getMenu(name).subscribe(menuItems => {
          this.group_name=localStorage.getItem('group_name')
          this.menuItems = menuItems['data'];
          this.navServices.sendLista(this.menuItems)
          this.servicePanel.sendShow(true)
          this.navServices.refreshGroupHeader(true)
          return this.router.navigate(['/panel']);
        }, error => {
          this.spinner.hide()
        })
      }else {
        this.spinner.hide()
      }
    }, error => {
      this.spinner.hide()
    })
  }

  listGroup(){
    this.spinner.show()
    this.generalService.getProfile().subscribe(resp=>{
      if(resp.success){
        this.profile=resp.data;
        this.list(resp.data_usuario.persona)
      }
    })
  }

  list(id){
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let f_fin:any = this.datePipe.transform(lastDay, 'dd');
    let f_inicio:any = this.datePipe.transform(date, 'dd');
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let inicio:any = firstDay.getTime() / 1000;
    let fin:any = lastDay.getTime() / 1000;
    let params = `fecha_inicio=${inicio}&fecha_fin=${fin}`
    this.days = f_fin - f_inicio;
    
    this.generalService.getComisiones2(id, params).subscribe(resp => {
      if(resp['success']==true){
        this.comisiones=+resp.ganancia_total
        this.generalService.getRango(id).subscribe(resp=>{
          if(resp.success){
            this.rango=resp.cantidad_puntos
            this.spinner.hide()
          }
        })
      }
    })
  }

  listAdmin(){
    this.spinner.show()
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let f_inicio:any = this.datePipe.transform(firstDay, 'yyyy-MM-dd');
    let f_fin:any = this.datePipe.transform(lastDay, 'yyyy-MM-dd');
    var laDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let fin:any = this.datePipe.transform(laDay, 'dd');
    let inicio:any = this.datePipe.transform(date, 'dd');
    this.days = fin - inicio;
    this.adminService.getNumberAfiliados(f_inicio, f_fin).subscribe(resp => {
      if(resp['success']==true){
        this.data_afiliado=resp.cantidad
        let params = `fecha_inicio=${f_inicio}&fecha_fin=${f_fin}`
        this.listTable(params)
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

  listTable(params){
    this.adminService.getHistoryMes(params).subscribe(resp => {
      if(resp['success']==true){
        this.reporte=resp.reporte
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
}
