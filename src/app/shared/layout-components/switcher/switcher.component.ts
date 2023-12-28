import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import {  Subscription } from 'rxjs';
import { SwitcherService } from '../../services/switcher.service';
import * as switcher from './switcher';

@Component({
  selector: 'app-switcher',
  templateUrl: './switcher.component.html',
  styleUrls: ['./switcher.component.scss'],
})
export class SwitcherComponent implements OnInit {
  layoutSub: Subscription;

  body = document.querySelector('body');

  @ViewChild('switcher', { static: false }) switcher!: ElementRef;
  constructor(
    public renderer: Renderer2,
    public switcherServic: SwitcherService
  ) {   
    this.layoutSub = switcherServic.changeEmitted.subscribe((value) => {
      if (value) {
        this.renderer.addClass(this.switcher.nativeElement.firstElementChild,'active');
        this.renderer.setStyle(this.switcher.nativeElement.firstElementChild,'right','0px');
        value = true;
      } else {
        this.renderer.removeClass(this.switcher.nativeElement.firstElementChild,'active');
        this.renderer.setStyle(this.switcher.nativeElement.firstElementChild,'right','-270px');
        value = false;
      }
      document.querySelector(".slide-leftRTL")?.classList.add("d-none")
      document.querySelector(".slide-rightRTL")?.classList.add("d-none")
    });
 
  }
  ngOnInit(): void {
    switcher.localStorageBackUp();
    switcher.customClickFn();
    switcher.updateChanges();
    // document.querySelector('#myonoffswitch1').checked = true
    if(document.body.classList.contains("transparent-mode") || document.body.classList.contains("dark-mode")){
      let light = document.getElementById('myonoffswitch1') as HTMLInputElement;
      light.checked = false;
    }
    else{
      let light = document.getElementById('myonoffswitch1') as HTMLInputElement;
      light.checked = true;

    }
  }
  reset(){
    let btnlight = document.getElementById('myonoffswitch1') as HTMLInputElement;
    btnlight.checked = true;
    let lightmenu = document.getElementById('myonoffswitch3') as HTMLInputElement;
    lightmenu.checked = true;
    let vertical = document.getElementById('myonoffswitch34') as HTMLInputElement;
    vertical.checked = true;
    let ltr = document.getElementById('myonoffswitch54') as HTMLInputElement;
    ltr.checked = true;
    let lightheader = document.getElementById('myonoffswitch6') as HTMLInputElement;
    lightheader.checked = true;
    let fullwidth = document.getElementById('myonoffswitch9') as HTMLInputElement;
    fullwidth.checked = true;
    let fixed = document.getElementById('myonoffswitch11') as HTMLInputElement;
    fixed.checked = true;

    localStorage.clear(); 
    let html:any = document.querySelector('html')
    let body = document.querySelector('body')
    html.style = ''; 
    body?.classList.remove('rtl');
    body?.classList.remove('dark-mode');
    body?.classList.remove('light-header');
    body?.classList.remove('dark-header');
    body?.classList.remove('color-header');
    body?.classList.remove('gradient-header');
    body?.classList.remove('light-menu');
    body?.classList.remove('color-menu');
    body?.classList.remove('dark-menu');
    body?.classList.remove('gradient-menu');
    body?.classList.remove('layout-boxed');
    body?.classList.remove('scrollable-layout');
    body?.classList.remove('bg-img1');
    body?.classList.remove('bg-img2');
    body?.classList.remove('bg-img3');
    body?.classList.remove('bg-img4');
    body?.classList.remove('transparent-mode');
    switcher.updateChanges();
    switcher.checkOptions();
    html.setAttribute('dir', 'ltr');
    let styleId = document.querySelector('#style');
    styleId?.setAttribute('href','./assets/plugins/bootstrap/css/bootstrap.css');
    localStorage.removeItem('Sashhorizontal')
    localStorage.removeItem('SashhorizontalHover')
    let mainContent: any = document.querySelector('.main-content');
    let mainContainer: any = document.querySelectorAll('.main-container');
    let appSidebar: any = document.querySelector('.app-sidebar');
    let header: any = document.querySelector('.header');
    let mainSidemenu: any = document.querySelector('.main-sidemenu');
    mainContent?.classList.add('app-content');
    mainContainer.forEach((e:any)=>{
      e.classList.add('container-fluid')
    })
    header?.classList.add('app-header');
    body?.classList.add('sidebar-mini');
    //remove
    body?.classList.remove('horizontal');
    body?.classList.remove('horizontal-hover');
    appSidebar?.classList.remove('horizontal-main');
    mainSidemenu?.classList.remove('container');
    mainContent?.classList.remove('hor-content');
    header?.classList.remove('hor-header');
    mainContainer.forEach((e:any)=>{
      e.classList.remove('container')
    })
    document.querySelector('.slide-left')?.classList.add('d-none');
    document.querySelector('.slide-right')?.classList.add('d-none');
    document.querySelector('.slide-leftRTL')?.classList.add('d-none');
    document.querySelector('.slide-rightRTL')?.classList.add('d-none');
  }

  public color1: string = '#6c5ffc';
  public color2: string = '#6c5ffc';
  public color3: string = '#6c5ffc';
  public color4: string = '#6c5ffc';
  public color13: string = '#6c5ffc';

  public dynamicLightPrimary(data: any): void {
    this.color1 = data.color;

    const dynamicPrimaryLight = document.querySelectorAll('input.color-primary-light');

    switcher.dynamicLightPrimaryColor(dynamicPrimaryLight, this.color1);
    
    localStorage.setItem('Sashlight-primary-color', this.color1);
    localStorage.setItem('Sashlight-primary-hover', this.color1);
    localStorage.setItem('Sashlight-primary-border', this.color1);
    let light = document.getElementById('myonoffswitch1') as HTMLInputElement;
    light.checked = true;
    localStorage.setItem('Sashlight-mode', 'true')
    this.body?.classList.remove("transparent-mode")
    // localStorage.clear()

    // Adding
    this.body?.classList.add('light-mode');

    // Removing
    this.body?.classList.remove('dark-mode');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4');
    // removing data from session storage
    localStorage.removeItem('Sashdark-primary-color');
    localStorage.removeItem('Sashdark-primary-hover');
    localStorage.removeItem('Sashdark-primary-border');
    localStorage.removeItem('Sashtransparent-primary-color');
    localStorage.removeItem('Sashtransparent-primary-hover');
    localStorage.removeItem('Sashtransparent-primary-border');
    localStorage.removeItem('Sashdark-body');    
    localStorage.removeItem('SashBgImage');
    localStorage.removeItem('SashTransparentTheme')
    localStorage.removeItem('Sashtransparent-bg-color')
    switcher.checkOptions();
    switcher.updateChanges();
  }
  public dynamicDarkPrimary(data: any): void {
    this.color2 = data.color;

    const dynamicPrimaryDark = document.querySelectorAll('input.color-primary-dark');

    switcher.dynamicDarkPrimaryColor(dynamicPrimaryDark, this.color2);
    
    localStorage.setItem('Sashdark-primary-color', this.color2);
    localStorage.setItem('Sashdark-primary-hover', this.color2);
    localStorage.setItem('Sashdark-primary-border', this.color2);
    let dark = document.getElementById('myonoffswitch2') as HTMLInputElement;
    dark.checked = true;
    localStorage.setItem('Sashdark-mode', 'true')
    localStorage.removeItem('Sashlight-mode')

    // Adding
    this.body?.classList.add('dark-mode');
    // removing data from session storage
    localStorage.removeItem('Sashlight-primary-color');
    localStorage.removeItem('Sashlight-primary-hover');
    localStorage.removeItem('Sashlight-primary-border');
    localStorage.removeItem('Sashtransparent-primary-color');
    localStorage.removeItem('Sashtransparent-primary-hover');
    localStorage.removeItem('Sashtransparent-primary-border');
    localStorage.removeItem('SashTransparentTheme')
    
    // Removing
    this.body?.classList.remove('light-mode');
    this.body?.classList.remove("transparent-mode")
    localStorage.removeItem('Sashtransparent-bg-color')
    switcher.checkOptions();
    switcher.updateChanges();
  }
  public dynamicDarkBg(data: any): void {
    document.querySelector('.app-header')?.classList.add("hor-header", "fixed-header", "visible-title", "stickyClass")
    this.color13 = data.color;
    localStorage.setItem('Sashtransparent-primary-color', this.color13);
    localStorage.setItem('Sashtransparent-primary-hover', this.color13);
    localStorage.setItem('Sashtransparent-primary-border', this.color13);

    const dynamicBodyDark = document.querySelectorAll('input.color-primary-transparent');

    switcher.dynamicTrasnsparentPrimaryColor(dynamicBodyDark, this.color13);
    

    
    // Adding
    this.body?.classList.add('transparent-mode');
    this.body?.classList.add('bg-img1');
    localStorage.setItem('SashTransparentTheme', 'true');
    localStorage.setItem('SashbgImage', 'true');
    localStorage.setItem('SashBgImage','bg-img1')
    
    // Removing
    this.body?.classList.remove('light-mode');
    // let allImg = document.querySelectorAll('.bg-img');
    // allImg.forEach((el, i) => {
    //   let ele = el.classList[0];
    //   this.body?.classList.remove(ele);
    // });

    // removing data from session storage
    localStorage.removeItem('Sashlight-primary-color');
    localStorage.removeItem('Sashlight-primary-hover');
    localStorage.removeItem('Sashlight-primary-border');
    // localStorage.removeItem('SashBgImage');
    localStorage.removeItem('Sashtransparent-bg-color')
    switcher.checkOptions();
    switcher.updateChanges();
  }


  public dynamicTranparentPrimary(data: any): void {
    this.color3 = data.color;

    const dynamicPrimaryTrasnsparent = document.querySelectorAll('input.color-primary-transparent');

    switcher.dynamicTrasnsparentPrimaryColor(
      dynamicPrimaryTrasnsparent,
      this.color3
    );
    localStorage.setItem('Sashtransparent-primary-color', this.color3);
    localStorage.setItem('Sashtransparent-primary-hover', this.color2);
    localStorage.setItem('Sashtransparent-primary-border', this.color2);
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    transparent.checked = true;

    // Adding
    this.body?.classList.add('transparent-mode');
    localStorage.setItem('SashTransparentTheme', 'true');
    
    // Removing
    this.body?.classList.remove("dark-mode")
    this.body?.classList.remove('light-mode');
    localStorage.removeItem('SashDarkTheme');
    localStorage.removeItem('SashLightTheme');
    this.body?.classList.remove('light-mode');
    this.body?.classList.remove('dark-mode');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4'); 
    this.body?.classList.remove('light-header');
    this.body?.classList.remove('dark-header');
    this.body?.classList.remove('color-header');
    this.body?.classList.remove('gradient-header');
    this.body?.classList.remove('light-menu');
    this.body?.classList.remove('color-menu');
    this.body?.classList.remove('dark-menu');
    this.body?.classList.remove('gradient-menu');
    document.querySelector('.app-header')?.classList.add("hor-header", "fixed-header", "visible-title", "stickyClass")

    localStorage.removeItem('Sashlight-primary-color');
    localStorage.removeItem('Sashlight-primary-hover');
    localStorage.removeItem('Sashlight-primary-border');
    localStorage.removeItem('Sashdark-primary-color');
    localStorage.removeItem('Sashdark-primary-hover');
    localStorage.removeItem('Sashdark-primary-border');
    localStorage.removeItem('Sashdark-body'); 
    localStorage.removeItem('SashBgImage');
    // localStorage.removeItem('Sashtransparent-bg-color')
    switcher.removeForTransparent();
    switcher.updateChanges();
  }

  public dynamicTranparentBgPrimary(data: any): void {
    this.color4 = data.color;

    const dynamicPrimaryBgTrasnsparent = document.querySelectorAll('input.color-bg-transparent');

    switcher.dynamicBgTrasnsparentPrimaryColor(
      dynamicPrimaryBgTrasnsparent,
      this.color4
    );
    localStorage.setItem('Sashtransparent-bg-color', this.color4);
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    transparent.checked = true;
    

    // Adding
    this.body?.classList.add('transparent-mode');
    localStorage.setItem('SashTransparentTheme', 'true');
    
    // Removing
    localStorage.removeItem('SashDarkTheme');
    localStorage.removeItem('SashLightTheme');
    this.body?.classList.remove('light-mode');
    this.body?.classList.remove('dark-mode');
    this.body?.classList.remove('bg-img1');
    this.body?.classList.remove('bg-img2');
    this.body?.classList.remove('bg-img3');
    this.body?.classList.remove('bg-img4'); 
    this.body?.classList.remove('light-header');
    this.body?.classList.remove('dark-header');
    this.body?.classList.remove('color-header');
    this.body?.classList.remove('gradient-header');
    this.body?.classList.remove('light-menu');
    this.body?.classList.remove('color-menu');
    this.body?.classList.remove('dark-menu');
    this.body?.classList.remove('gradient-menu');
    document.querySelector('.app-header')?.classList.add("hor-header", "fixed-header", "visible-title", "stickyClass")

    localStorage.removeItem('Sashlight-primary-color');
    localStorage.removeItem('Sashlight-primary-hover');
    localStorage.removeItem('Sashlight-primary-border');
    localStorage.removeItem('Sashdark-primary-color');
    localStorage.removeItem('Sashtransparent-bgImg-primary-color');
    localStorage.removeItem('SashBgImage');
    switcher.removeForTransparent();
    switcher.updateChanges();
  }

  bgImage(e: any) {
    let transparent = document.getElementById('myonoffswitchTransparent') as HTMLInputElement;
    document.querySelector('.app-header')?.classList.add("hor-header", "fixed-header", "visible-title", "stickyClass")

    transparent.checked = true;

    let img = e.parentElement.classList[0];
    localStorage.setItem('SashBgImage', img);
    localStorage.setItem('SashbgImage', 'true')
    localStorage.removeItem('Sashlight-mode')
    // this.body?.classList.add(img);
    let allImg = document.querySelectorAll('.bg-img');
    allImg.forEach((el, i) => {
      let ele = el.classList[0];
      this.body?.classList.remove(ele);
      this.body?.classList.add(img);
    });

    // Adding
    this.body?.classList.add('transparent-mode'); 

    // Removing
    this.body?.classList.remove("dark-mode")
    this.body?.classList.remove('light-mode');
    localStorage.removeItem('Sashlight-primary-color');
    localStorage.removeItem('Sashlight-primary-hover');
    localStorage.removeItem('Sashlight-primary-border');
    localStorage.removeItem('Sashdark-body');
    
    switcher.removeForTransparent();
    switcher.updateChanges();
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
