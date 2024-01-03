import {Component, ViewEncapsulation, HostListener, ElementRef, Input, OnInit} from '@angular/core';
import {NavigationEnd,Router,} from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { switcherArrowFn, checkHoriMenu } from './sidebar';
import { fromEvent, Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {AuthServiceService} from "../../../authentication/services/auth-service.service";
import { PanelService } from '../../services/panel.service';
import { GeneralService } from 'src/app/panel/services/general.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent implements OnInit {
  token = localStorage.getItem('token');
  url_logo = localStorage.getItem('empresa_logo');
  public menuItems!: Menu[];
  public url: any;
  public windowSubscribe$!: Subscription;
  public routerSubscription$!: Subscription;
  public logo$!: Subscription;
  public menuitemsSubscribe$!: Subscription;
  public scrolled: boolean = false;
  @HostListener('window:scroll', [])
  @Input() menu:any
  onWindowScroll() {
    this.scrolled = window.scrollY > 74;
  }
  constructor(
    private breakpointObserver: BreakpointObserver,private servicePanel: PanelService, private generalService: GeneralService,
    private router: Router,private spinner: NgxSpinnerService,
    private service: AuthServiceService,
    private navServices: NavService,
    public elRef: ElementRef,
  ) {

  }
  @Input()show:any
  public user!: { id: number };

  logos:any

  ngOnInit() {
    this.listMenu()

    this.routerSubscription$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (document.body.classList.contains('horizontal')) {
          this.closeNavActive();
        } else {
          this.checkCurrentPath(event.url);
        }
      }
    });

    switcherArrowFn();

    this.breakpointObserver
      .observe(['(max-width: 991px)'])
      .subscribe((result: BreakpointState) => {
        if (result.matches) {
          // small screen
          this.checkCurrentPath(location.pathname);
        } else {
          // large screen
          document
            .querySelector('body.horizontal')
            ?.classList.remove('sidenav-toggled');
          if (document.querySelector('.horizontal')) {
            this.closeNavActive();
          } else {
            this.checkCurrentPath(location.pathname);
          }
        }
      });

    let vertical: any = document.querySelectorAll('#myonoffswitch34');
    let horizontal: any = document.querySelectorAll('#myonoffswitch35');
    let horizontalHover: any = document.querySelectorAll('#myonoffswitch111');
    let mainContent: any = document.querySelectorAll('.main-content');
    fromEvent(vertical, 'click').subscribe(() => {
      this.checkCurrentPath(location.pathname);
    });
    fromEvent([horizontal, horizontalHover], 'click').subscribe(() =>
      this.closeNavActive()
    );
    fromEvent(mainContent, 'click').subscribe(() => {
      if (document.body.classList.contains('horizontal')) {
        this.closeNavActive();
      }
    });

    this.checkCurrentPath('/e-commerce/shop');

    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    this.windowSubscribe$ = WindowResize.subscribe(() => {
      // to check and adjst the menu on screen size change
      checkHoriMenu();
    });
  }

  listMenu(){
    this.generalService.listGrupos().subscribe(resp => {
      let name = null
      resp['grupos'].forEach(i=>{
        name = i
      })
      if(name){
        localStorage.setItem('group_name', name)
        this.navServices.getMenu(name).subscribe(menuItems => {
          this.menuItems = menuItems['data'];
          this.navServices.sendLista(this.menuItems)
          this.servicePanel.sendShow(true)
          this.navServices.refreshGroupHeader(true)          
          this.menuitemsSubscribe$ = this.navServices.quantityCartObs.subscribe(
            (items) => (this.menuItems = items)
          )
        }, error => {
        })
      }else {
      }
    }, error => {
    })
  }

  checkCurrentPath(event: string) {
    if(this.menuItems) {
      this.menuItems.filter((firstLevel) => {
        if (firstLevel.path === event) {
          this.setNavActive(event);
        }
        if (!firstLevel.children) {
          return;
        }
        firstLevel.children.filter((secondlevel) => {


          if (secondlevel.path === event) {
            this.setNavActive(secondlevel);
          }
          /*if(secondlevel.items){
            secondlevel.items.filter((secondlevelitem) => {
              if (secondlevelitem.path === event) {
                this.setNavActive(secondlevelitem);
              }
            })
          }*/
          if (!secondlevel.children) {
            return;
          }
          secondlevel.children.filter((thirdlevel) => {
            if (thirdlevel.path === event) {
              this.setNavActive(thirdlevel);
            }
            if (!thirdlevel.children) {
              return;
            }
            thirdlevel.children.filter((fourthlevel) => {
              if (fourthlevel.path === event) {
                this.setNavActive(fourthlevel);
              }
            });
          });
        });
      });
    }
  }

  ngOnDestroy() {
    this.menuitemsSubscribe$.unsubscribe();
    this.routerSubscription$.unsubscribe();
    this.windowSubscribe$.unsubscribe();
  }

  toggleNavActive(item: any) {
    if(item.type=='sub'){
      if (!item.active) {
        this.menuItems.forEach((firstlevel: any) => {
          if (this.menuItems.includes(item)) {
            firstlevel.active = false;
          }
          if (!firstlevel.children) return;
          if (firstlevel.children) {
            firstlevel.children.forEach((secondlevel: any) => {
              if (firstlevel.children.includes(secondlevel)) {
                secondlevel.active = false;
              }
              if (!secondlevel.children) return;

              secondlevel.children.forEach((thirdlevel: any) => {
                if (secondlevel.children.includes(thirdlevel)) {
                  thirdlevel.active = false;
                }
                if (!thirdlevel.children) return;

                thirdlevel.children.forEach((fourthlevel: any) => {
                  if (thirdlevel.children.includes(fourthlevel)) {
                    fourthlevel.active = false;
                  }
                  if (!fourthlevel.children) return;
                });
              });
            });
          }
        });
      }
      item.active = !item.active;
    }
    else {
      this.sidebarClose()
    }
  }

  setNavActive(item: any) {

    this.menuItems.filter((main) => {

      if (main !== item) {
        main.active = false;
        main.selected = false;
      }
      if (main.children && main.children.includes(item)) {
        main.active = true;
        main.selected = true;
      }
      if (main.children) {
        main.children.filter((secondlevel) => {
          if (secondlevel !== item) {
            secondlevel.active = false;
            secondlevel.selected = false;
          }
          if (secondlevel.children && secondlevel.children.includes(item)) {
            main.active = true;
            main.selected = true;
            secondlevel.active = true;
            secondlevel.selected = true;
          }/*

          if(secondlevel.items){
            secondlevel.items.filter(() => {
              if (secondlevelitems && secondlevel.items.includes(item)) {

                main.active = true;
                main.selected = true;
                secondlevelitems.active = true;
                secondlevelitems.selected = true;
              }

            })
          }*/
          if (secondlevel.children) {
            secondlevel.children.filter((thirdlevel) => {
              if (thirdlevel !== item) {
                thirdlevel.active = false;
                thirdlevel.selected = false;
              }
              if (thirdlevel.children && thirdlevel.children.includes(item)) {
                main.active = true;
                main.selected = true;
                secondlevel.active = true;
                secondlevel.selected = true;
                thirdlevel.active = true;
                thirdlevel.selected = true;
              }
              if (thirdlevel.children) {
                thirdlevel.children.filter((fourthlevel) => {
                  if (fourthlevel !== item) {
                    fourthlevel.active = false;
                    fourthlevel.selected = false;
                  }
                  if (
                    fourthlevel.children &&
                    fourthlevel.children.includes(item)
                  ) {
                    main.active = true;
                    main.selected = true;
                    secondlevel.active = true;
                    secondlevel.selected = true;
                    thirdlevel.active = true;
                    thirdlevel.selected = true;
                    fourthlevel.active = true;
                    fourthlevel.selected = true;
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  closeNavActive() {
    this.menuItems.filter((main) => {
      main.active = false;
      if (main.children) {
        main.children.filter((secondlevel) => {
          secondlevel.active = false;
          if (secondlevel.children) {
            secondlevel.children.filter((thirdlevel) => {
              thirdlevel.active = false;
              if (thirdlevel.children) {
                thirdlevel.children.filter((fourthlevel) => {
                  fourthlevel.active = false;
                });
              }
            });
          }
        });
      }
    });
  }

  sidebarClose() {
    if ((this.navServices.collapseSidebar = true)) {
      document.querySelector('.app')?.classList.remove('sidenav-toggled');
      this.navServices.collapseSidebar = false;
    }
  }

  logout(){
    this.service.isLogoutUnathorizated()

    return this.router.navigate(['/']);
  }
}
