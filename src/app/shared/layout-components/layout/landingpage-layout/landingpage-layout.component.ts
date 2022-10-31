import { Component, OnInit } from '@angular/core';
import { SwitcherService } from 'src/app/shared/services/switcher.service';

@Component({
  selector: 'app-landingpage-layout',
  templateUrl: './landingpage-layout.component.html',
  styleUrls: ['./landingpage-layout.component.scss']
})
export class LandingpageLayoutComponent implements OnInit {

  constructor(public SwitcherService: SwitcherService,) { 
    document.body.classList.add('landing-page', 'horizontal')
    document.body.classList.remove("sidebar-mini")
    if(localStorage.getItem('SashDarkTheme') !== null){
      document.querySelector('body')?.classList.add('dark-mode');
    }
    if(localStorage.getItem('SashTransparentTheme') !== null){
      document.querySelector('body')?.classList.add('transparent-mode');
    }
    if(localStorage.getItem('SashLightTheme') !== null){
      document.querySelector('body')?.classList.add('light-mode');
    }
    if (localStorage.getItem('SashBgImage') !== null) {
      document.querySelector('body')?.classList.add('transparent-mode');
      document.querySelector('.app-header')?.classList.add("hor-header", "fixed-header", "visible-title", "stickyClass")
      document.querySelector('body')?.classList.remove('light-mode');
      let BgImage:any = localStorage.getItem('SashBgImage')
      document.querySelector('body')?.classList.add(BgImage)

    }
  }

  ngOnInit(): void {
  }

  toggleSwitcherBody() {
    this.SwitcherService.emitChange(false);
  }

}
