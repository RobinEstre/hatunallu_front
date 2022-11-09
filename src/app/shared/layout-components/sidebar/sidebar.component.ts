import {Component,ViewEncapsulation,HostListener,ElementRef,} from '@angular/core';
import {NavigationEnd,Router,} from '@angular/router';
import { Menu, NavService } from '../../services/nav.service';
import { switcherArrowFn, checkHoriMenu } from './sidebar';
import { fromEvent, Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
//import { ProductdetailsService } from 'src/app/components/e-commerce/product-details/productdetails.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SidebarComponent {
  public menuItems!: Menu[];
  public url: any;
  public windowSubscribe$!: Subscription;
  public routerSubscription$!: Subscription;
  public menuitemsSubscribe$!: Subscription;
  public scrolled: boolean = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 74;
  }
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private navServices: NavService,
    public elRef: ElementRef,
    //public productdetailsService: ProductdetailsService
  ) {

  }
  public user!: { id: number };

  ngOnInit() {
    this.menuitemsSubscribe$ = this.navServices.items.subscribe(
      (items) => (this.menuItems = items)
    );

    this.checkCurrentPath(location.pathname);
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
    /*
    this.productdetailsService.dynamicProductId.subscribe((value) => {
      if (value !== null || value !== undefined) {
        if (value.match('/e-commerce/shop'))
          this.checkCurrentPath('/e-commerce/shop');
        // any other path like invoice or other.
      }
    });*/

    this.checkCurrentPath('/e-commerce/shop');

    const WindowResize = fromEvent(window, 'resize');
    // subscribing the Observable
    this.windowSubscribe$ = WindowResize.subscribe(() => {
      // to check and adjst the menu on screen size change
      checkHoriMenu();
    });
  }

  checkCurrentPath(event: string) {
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

  ngOnDestroy() {
    this.menuitemsSubscribe$.unsubscribe();
    this.routerSubscription$.unsubscribe();
    this.windowSubscribe$.unsubscribe();
  }

  toggleNavActive(item: any) {
    if (!item.active) {
      this.menuItems.forEach((firstlevel: any) => {
        if (this.menuItems.includes(item)) {
          firstlevel.active = false;
        }
        if (!firstlevel.children) return;

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
      });
    }
    item.active = !item.active;
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
}
