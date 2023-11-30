import { Component, HostListener, OnInit } from '@angular/core';
import { Menu, NavService } from 'src/app/shared/services/nav.service';
import { SwitcherService } from 'src/app/shared/services/switcher.service';
//import jwt_decode from "jwt-decode";
import {AuthServiceService} from "../../../../authentication/services/auth-service.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import { PanelService } from 'src/app/shared/services/panel.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit {
  public menuItems!: Menu[];
  public menu!: Menu[];
  config = localStorage.getItem('config');
  token = localStorage.getItem('token');
  public menuitemsSubscribe$!: Subscription;
  decodedConfig:any
  data_menu:any
  empresas:any
  show:boolean = false
  side:boolean=false

  constructor(  private loginService: AuthServiceService, private service: PanelService, private router: Router,
                public SwitcherService: SwitcherService, public navServices: NavService,
  ) {}

  ngOnInit() {
    this.getDataObservable()
  }

  getDataObservable(){
    this.service.ShowEmpresaObs.subscribe(item => {
      this.validateEmpresa(item)
    })
  }

  validateEmpresa(item){
    if(item){
      this.getShow()
      this.show=true
      //this.decodedConfig = jwt_decode(this.config);
      document.querySelector(".slide-leftRTL")?.classList.add("d-none")
      document.querySelector(".slide-rightRTL")?.classList.add("d-none")

    }else{
      this.getShow()
      this.show=false
      return this.router.navigate(['/panel'])
    }
  }

  getShow(){
    this.menuitemsSubscribe$ = this.service.quantityShow.subscribe(
      (items) => (this.show=items)
    )

    if(this.show==true){
      this.show=true
      //this.decodedConfig = jwt_decode(this.config);
      document.querySelector(".slide-leftRTL")?.classList.add("d-none")
      document.querySelector(".slide-rightRTL")?.classList.add("d-none")
    }
  }

  sidebar(data){
    this.data_menu=data
  }

  toggleSwitcherBody() {
    this.SwitcherService.emitChange(false);
  }

  ngOnDestroy(){
    location.reload()
  }

  scrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 74;
  }


}
