import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';/*
import { deleteShopData } from '../../ngrx/e-commerce/shop.action';
import { ShopService } from '../../services/e-commerce/shop.service';*/
import { LayoutService } from '../../services/layout.service';
import { Menu, NavService } from '../../services/nav.service';
import { SwitcherService } from '../../services/switcher.service';
import {AuthServiceService} from "../../../authentication/services/auth-service.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isCollapsed = true;
  token = localStorage.getItem('token');
  text:any =''

  constructor(
    private layoutService: LayoutService, public navServices: NavService, private modalService: NgbModal,
    public SwitcherService : SwitcherService, private router: Router, private logoutService: AuthServiceService
  ){}

  ngOnInit(): void {
  }

  open(content:any) {
    this.modalService.open(content, {backdrop : 'static' , windowClass : 'modalCusSty', size: 'lg' })
  }

  toggleSwitcher() {
    this.SwitcherService.emitChange(true);
    document.querySelector('body')?.classList.remove("sidenav-toggled-open")
  }

  toggleSidebarNotification() {
    this.layoutService.emitSidebarNotifyChange(true);
  }

  signout() {
    return this.router.navigate(['/authentication/login']);
    /*const path = 'users/logout/?token=' + this.token;
    this.logoutService.logout(path).subscribe(resp => {
      if (resp['success'] === true) {
        localStorage.removeItem('token');
        localStorage.removeItem('rus');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('user');
        return this.router.navigate(['/authentication/login']);
      }
    });*/
  }
}
