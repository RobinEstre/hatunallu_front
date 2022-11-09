import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

// Menu
export interface Menu {
  headTitle?: string;
  headTitle2?: string;
  path?: any;
  title?: string;
  icon?: string;
  type?: string;
  badgeValue?: string;
  badgeClass?: string;
  active?: boolean;
  selected?: boolean;
  bookmark?: boolean;
  children?: Menu[];
  Menusub?: boolean;
  target?: boolean;
  items?: any;
}
@Injectable({
  providedIn: 'root',
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(
    window.innerWidth
  );

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, 'resize')
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscriber.next;
    this.unsubscriber.complete();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  MENUITEMS: Menu[] = [
    {
      headTitle: 'INCIO',
    },
    {
      title: 'Dashboard',
      selected: false,
      icon: 'home',
      active: true,
      path: 'almacen/dashboard',
      type: 'link',
      badgeClass:
        'badge bg-green br-5 side-badg, selected: falsee blink-text pb-1',
      badgeValue: 'New',
    },
    {
      headTitle: 'UI KIT',
    },
    {
      title: 'Entrada Producto',
      selected: false,
      icon: 'file-plus',
      active: true,
      path: 'almacen/entrada',
      type: 'link',
    },
    {
      path: '/landing-page',
      icon: 'file-minus',
      title: 'Salida Producto',
      type: 'link',
    },
    /*
    {
      title: 'Apps',
      selected: false,
      icon: 'slack',
      type: 'sub',
      Menusub: true,
      active: false,
      children: [
        {
          path: '/apps/cards-design',
          title: 'Cards Design',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/default-calender',
          title: 'Default calender',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/full-calendar',
          title: 'Full calendar',
          type: 'link',
          selected: false,
        },
        { path: '/apps/chat',
          title: 'Chat', type: 'link', selected: false },
        {
          path: '/apps/notifications',
          title: 'Notifications',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/sweet-alerts',
          title: 'Sweet alerts',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/range-slider',
          title: 'Range slider',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/content-scroll-bar',
          title: 'Content Scroll bar',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/loaders',
          title: 'Loaders',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/counters',
          title: 'Counters',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/rating',
          title: 'Rating',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/timeline',
          title: 'Timeline',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/treeview',
          title: 'Treeview',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/charts',
          title: 'Charts',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/footers',
          title: 'Footers',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/user-list',
          title: 'User List',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/search',
          title: 'Search',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/crypyo-currencies',
          title: 'Crypyo-currencies',
          type: 'link',
          selected: false,
        },
        {
          path: '/apps/widgets',
          title: 'Widgets',
          type: 'link',
          selected: false,
        },
      ],
    },
    {
      title: 'Bootstrap',
      selected: false,
      icon: 'package',
      type: 'mega-menu',
      Menusub: true,
      active: false,
      children: [
        {
          items: [
            {
              path: '/bootstrap/alerts',
              title: 'Alerts',
              type: 'link',
              selected: false,
            },
          ],
        },
        {
          items: [
            {
              path: '/bootstrap/list-group',
              title: 'List Group',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/tags',
              title: 'Tags',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/pagination',
              title: 'Pagination',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/navigation',
              title: 'Navigation',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/typography',
              title: 'Typography',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/breadcrumbs',
              title: 'Breadcrumbs',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/badges-pills',
              title: 'Badges/Pills',
              type: 'link',
              selected: false,
            },
          ],
        },
        {
          items: [
            {
              path: '/bootstrap/panels',
              title: 'Panels',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/thumbnails',
              title: 'Thumbnails',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/offcanvas',
              title: 'Offcanvas',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/toast',
              title: 'Toast',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/scrollspy',
              title: 'Scrollspy',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/media-object',
              title: 'Media Object',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/accordions',
              title: 'Accordions',
              type: 'link',
              selected: false,
            },
          ],
        },
        {
          items: [
            {
              path: '/bootstrap/tabs',
              title: 'Tabs',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/modal',
              title: 'Modal',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/tooltip-and-popover',
              title: 'Tooltip and popover',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/progress',
              title: 'progress',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/carousels',
              title: 'Carousels',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/ribbons',
              title: 'Ribbons',
              type: 'link',
              selected: false,
            },
          ],
        },
      ],
    },*/
    {
      path: '/landing-page',
      icon: 'inbox',
      title: 'Pedidos',
      type: 'link',
      badgeClass:
        'badge bg-red br-5 side-badg, selected: falsee blink-text pb-1',
      badgeValue: '5',
    },
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
