import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-layout',
  templateUrl: './error-layout.component.html',
  styleUrls: ['./error-layout.component.scss']
})
export class ErrorLayoutComponent implements OnInit {

  constructor() { 
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

}
