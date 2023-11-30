import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from '../../services/general.service';
import { NavService } from 'src/app/shared/services/nav.service';
import { Router } from '@angular/router';
import { PanelService } from 'src/app/shared/services/panel.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private generalService: GeneralService, public navServices: NavService,private router: Router,
    private servicePanel: PanelService) { }
  
  menuItems: any[] = []

  ngOnInit(): void {
    this.listGroup()
  }

  listGroup(){
    this.spinner.show()
    this.generalService.listGrupos().subscribe(resp => {
      console.log(resp)
      let name = null
      resp['grupos'].forEach(i=>{
        name = i
      })
      console.log(name)
      if(name){
        console.log('paso la condicional')
        localStorage.setItem('group_name', name)
        this.navServices.getMenu(name).subscribe(menuItems => {
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

}
