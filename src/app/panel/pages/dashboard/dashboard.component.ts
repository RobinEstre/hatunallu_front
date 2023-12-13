import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/shared/services/panel.service';
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class DashboardComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private generalService: GeneralService, public navServices: NavService,private router: Router,
    private servicePanel: PanelService, private datePipe: DatePipe) { }
  
  menuItems: any[] = []; group_name:any; rango:any; days:any; comisiones:any

  ngOnInit(): void {
    this.listGroup()
  }

  listGroup(){
    this.spinner.show()
    this.generalService.getProfile().subscribe(resp=>{
      if(resp.success){
        this.list(resp.data_usuario.persona)
      }
    })
    this.generalService.listGrupos().subscribe(resp => {
      let name = null
      resp['grupos'].forEach(i=>{
        name = i
      })
      if(name){
        localStorage.setItem('group_name', name)
        this.navServices.getMenu(name).subscribe(menuItems => {
          this.group_name=localStorage.getItem('group_name')
          this.spinner.hide()
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

  list(id){
    var date = new Date();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let f_fin:any = this.datePipe.transform(lastDay, 'dd');
    let f_inicio:any = this.datePipe.transform(date, 'dd');
    this.days = f_fin - f_inicio;
    
    this.generalService.getComisiones(id).subscribe(resp => {
      if(resp['success']==true){
        this.comisiones=+resp.ganancia_total
        this.generalService.getRango(id).subscribe(resp=>{
          if(resp.success){
            this.rango=resp
          }
        })
      }
    })
  }
}
