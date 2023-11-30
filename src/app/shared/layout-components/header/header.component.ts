import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../../services/layout.service';
import { Menu, NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';
import {AuthServiceService} from "../../../authentication/services/auth-service.service";
import { GeneralService } from 'src/app/panel/services/general.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isCollapsed = true;
  token = localStorage.getItem('token');
  text:any =''

  body = document.querySelector('body');

  empresas:any=[
    {
      id: '01',
      icon: 'institution',
      name: 'HERITAGE'
    },
    {
      id: '02',
      icon: 'institution',
      name: 'TEXTILES'
    },
    {
      id: '03',
      icon: 'institution',
      name: 'ROBIN SAC'
    },
  ]

  constructor(
    private layoutService: LayoutService, public navServices: NavService, private modalService: NgbModal,private service: GeneralService,
    public SwitcherService : SwitcherService, private router: Router, private logoutService: AuthServiceService
  ){}

  profile:any;userName:any;userImg:any;grupo:any

  ngOnInit(): void {
    this.service.miVariable$.subscribe(data => {
      if(data==true){
        this.listInit()
      }
    });
    this.listInit()
  }
  
  listInit(){
    this.service.getProfile().subscribe(resp=>{
      if(resp.success){
        let img_perfil= resp.data.data.img_perfil
        this.profile=resp.data;
        this.service.setUserImg(img_perfil)
        this.service.setUserName(this.profile.nombre +' '+ this.profile.apellido)
        this.userName = localStorage.getItem('USERNAME');
        this.userImg = localStorage.getItem('IMG_USER');
      }
    },error => {
    })
  }

  open(content:any) {
    this.modalService.open(content, {backdrop : 'static' , windowClass : 'modalCusSty', size: 'lg' })
  }

  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
    document.querySelector('body')?.classList.remove("sidenav-toggled-open")
  }

  toggleSidebar(){
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector("body")?.classList.toggle("sidenav-toggled")
    }
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    localStorage.removeItem('token');
    return this.router.navigate(['/auth/login']);
    const path = 'users/logout/?token=' + this.token;
    this.logoutService.logout(path).subscribe(resp => {
      if (resp['success'] === true) {
        localStorage.removeItem('token');
        localStorage.removeItem('rus');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        return this.router.navigate(['/authentication/login']);
      }
    });
  }

  changeTheme(n){
    if(n=='01'){
      this.LightTheme()
    }else if(n=='02'){
      this.DarkTheme()
    }else{
      this.TransparentTheme()
    }
  }

  LightTheme(){
    // localStorage.clear()

    // Adding
    this.body?.classList.add('light-mode');

    // Removing
    localStorage.setItem("SashLightTheme","true")
    this.body?.classList.remove("transparent-mode")
    this.body?.classList.remove("dark-mode")
    localStorage.removeItem("SashTransparentTheme")
    localStorage.removeItem("SashDarkTheme")
  }

  DarkTheme(){
    // localStorage.clear()

    //Adding
    localStorage.setItem("SashDarkTheme","true")
    this.body?.classList.add("dark-mode")

    // Removing
    this.body?.classList.remove("transparent-mode")
    this.body?.classList.remove("light-mode")
    localStorage.removeItem("SashTransparentTheme")
    localStorage.removeItem("SashLightTheme")
  }

  TransparentTheme(){
    // localStorage.clear()
    document.documentElement.style.setProperty('--primary-bg-color', 'var(--primary)');
    document.documentElement.style.setProperty('--primary02', 'rgba(var(--primary),0.2)');
    document.documentElement.style.setProperty('--primary0', 'var(--primary)');

    //Adding
    localStorage.setItem("SashTransparentTheme","true")
    this.body?.classList.add("transparent-mode")
    document.querySelector('.app-header')?.classList.add("hor-header", "fixed-header", "visible-title", "stickyClass")

    // Removing
    this.body?.classList.remove("dark-mode")
    this.body?.classList.remove("light-mode")
    document.querySelector('body')?.classList.remove('light-mode');
    document.querySelector('body')?.classList.remove('bg-img1');
    document.querySelector('body')?.classList.remove('bg-img2');
    document.querySelector('body')?.classList.remove('bg-img3');
    document.querySelector('body')?.classList.remove('bg-img4');
    localStorage.removeItem("SashDarkTheme")
    localStorage.removeItem("SashLightTheme")
    localStorage.removeItem("SashbgImage")
    localStorage.removeItem("SashBgImage")
    localStorage.removeItem("Sashdark-primary-hover")
    localStorage.removeItem("Sashdark-mode")
    let lightheader = document.getElementById('myonoffswitch6') as HTMLInputElement;
    lightheader.checked = false;
    let lightmenu = document.getElementById('myonoffswitch3') as HTMLInputElement;
    lightmenu.checked = false;
  }
}
