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
      headTitle: 'MAIN',
    },
    {
      title: 'Dashboard',
      selected: false,
      icon: 'home',
      active: true,
      path: '/dashboard',
      type: 'link',
    },
    {
      headTitle: 'UI KIT',
    },
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
            {
              path: '/bootstrap/buttons',
              title: 'Buttons',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/colors',
              title: 'Colors',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/avatars/avatar-square',
              title: 'Avatar-Square',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/avatars/avatar-rounded',
              title: 'Avatar-Rounded',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/avatars/avatar-radius',
              title: 'Avatar-Radius',
              type: 'link',
              selected: false,
            },
            {
              path: '/bootstrap/drop-downs',
              title: 'Drop downs',
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
    },
    {
      path: '/landing-page',
      icon: 'zap',
      title: 'Landing Page',
      type: 'external',
      badgeClass:
        'badge bg-green br-5 side-badg, selected: falsee blink-text pb-1',
      badgeValue: 'New',
    },

    {
      headTitle: 'PRE-BUILD PAGES',
    },
    {
      title: 'Pages',
      selected: false,
      icon: 'layers',
      type: 'sub',
      Menusub: true,
      active: false,
      children: [
        {
          path: '/pages/profile',
          title: 'Profile',
          type: 'link',
          selected: false,
        },
        {
          path: '/pages/edit-profile',
          title: 'Edit Profile',
          type: 'link',
          selected: false,
        },
        {
          path: '/pages/notifications-list',
          title: 'Notifications List',
          type: 'link',
          selected: false,
        },
        {
          path: '/pages/mail-compose',
          title: 'Mail-Compose',
          type: 'link',
          selected: false,
        },
        {
          path: '/pages/mail-indox',
          title: 'Mail-Indox',
          type: 'link',
          selected: false,
        },
        {
          path: '/pages/mail-read',
          title: 'Mail-Read',
          type: 'link',
          selected: false,
        },
        {
          path: '/pages/gallery',
          title: 'Gallery',
          type: 'link',
          selected: false,
        },
        {
          title: 'Forms',
          type: 'sub',
          Menusub: true,
          active: false,
          children: [
            {
              path: '/pages/forms/form-elements',
              title: 'Form Elements',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/forms/form-layouts',
              title: 'Form Layouts',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/forms/form-advanced',
              title: 'Form Advanced',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/forms/form-editors',
              title: 'Form Editor',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/forms/form-wizard',
              title: 'Form Wizard',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/forms/form-validation',
              title: 'Form Validation',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/forms/form-input-spinners',
              title: 'Form Input Spinners',
              type: 'link',
              selected: false,
            },
          ],
        },
        {
          title: 'Tables',
          type: 'sub',
          Menusub: true,
          active: false,
          children: [
            {
              path: '/pages/table/default-table',
              title: 'Default table',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/table/data-tables',
              title: 'Data Tables',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/table/edit-tables',
              title: 'Edit Tables',
              type: 'link',
              selected: false,
            },
          ],
        },
        {
          title: 'Extension',
          type: 'sub',
          Menusub: true,
          active: false,
          children: [
            {
              path: '/pages/extension/about-company',
              title: 'About Company',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/service',
              title: 'Service',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/faqs',
              title: 'FAQS',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/terms',
              title: 'Terms',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/invoice',
              title: 'Invoice',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/pricing-tables',
              title: 'Pricing Tables',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/setting',
              title: 'Setting',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/blog',
              title: 'Blog',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/blog-details',
              title: 'Blog Details',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/blog-post',
              title: 'Blog Post',
              type: 'link',
              selected: false,
            },
            {
              path: '/pages/extension/empty-page',
              title: 'Empty Page',
              type: 'link',
              selected: false,
            },
            {
              path: '/custompages/under-construction',
              title: 'Under Construction',
              type: 'link',
              selected: false,
            },
          ],
        },
        {
          path: '/switcher-one-route',
          title: 'Switcher',
          type: 'link',
          selected: false,
        },
      ],
    },
    {
      title: 'E-Commerce',
      selected: false,
      icon: 'shopping-bag',
      type: 'sub',
      Menusub: true,
      active: false,
      children: [
        {
          path: '/e-commerce/shop',
          title: 'Shop',
          type: 'link',
          selected: false,
        },
        {
          path: '/e-commerce/shop/1',
          title: 'Product Details',
          type: 'link',
          selected: false,
        },
        {
          path: '/e-commerce/shopping-cart',
          title: 'Shopping Cart',
          type: 'link',
          selected: false,
        },
        {
          path: '/e-commerce/add-product',
          title: 'Add Product',
          type: 'link',
          selected: false,
        },
        {
          path: '/e-commerce/wishlist',
          title: 'Wishlist',
          type: 'link',
          selected: false,
        },
        {
          path: '/e-commerce/checkout',
          title: 'Checkout',
          type: 'link',
          selected: false,
        },
      ],
    },
    {
      title: 'File Manager',
      selected: false,
      icon: 'folder',
      type: 'sub',
      Menusub: true,
      active: false,
      badgeValue: '4',
	  badgeClass: 'pink',
      children: [
        {
          path: '/file-manager/file-manager',
          title: 'File Manager',
          type: 'link',
          selected: false,
        },
        {
          path: '/file-manager/file-manager-list',
          title: 'File Manager List',
          type: 'link',
          selected: false,
        },
        {
          path: '/file-manager/file-details',
          title: 'File Details',
          type: 'link',
          selected: false,
        },
        {
          path: '/file-manager/file-attachments',
          title: 'File Attachments',
          type: 'link',
          selected: false,
        },
      ],
    },
    {
      headTitle: 'MISC PAGES',
    },
    {
      title: 'Authentication',
      selected: false,
      icon: 'users',
      type: 'sub',
      Menusub: true,
      active: false,
      children: [
        {
          path: '/custompages/login',
          title: 'Login',
          type: 'link',
          selected: false,
        },
        {
          path: '/custompages/register',
          title: 'register',
          type: 'link',
          selected: false,
        },
        {
          path: '/custompages/forgot-password',
          title: 'Forgot password',
          type: 'link',
          selected: false,
        },
        {
          path: '/custompages/lockscreen',
          title: 'Lock screen',
          type: 'link',
          selected: false,
        },
        {
          title: 'Error pages',
          type: 'sub',
          Menusub: true,
          active: false,
          children: [
            {
              path: '/custompages/error400',
              title: '400',
              type: 'link',
              selected: false,
            },
            {
              path: '/custompages/error401',
              title: '401',
              type: 'link',
              selected: false,
            },
            {
              path: '/custompages/error403',
              title: '403',
              type: 'link',
              selected: false,
            },
            {
              path: '/custompages/error404',
              title: '404',
              type: 'link',
              selected: false,
            },
            {
              path: '/custompages/error500',
              title: '500',
              type: 'link',
              selected: false,
            },
            {
              path: '/custompages/error503',
              title: '503',
              type: 'link',
              selected: false,
            },
          ],
        },
      ],
    },
    {
      headTitle: 'GENERAL',
    },
    {
      title: 'Maps',
      selected: false,
      icon: 'map-pin',
      type: 'sub',
      Menusub: true,
      active: false,
      children: [
        {
          path: '/maps/leaflet-maps',
          title: 'Leaflet Maps',
          type: 'link',
          selected: false,
        },
      ],
    },
    {
      title: 'Charts',
      selected: false,
      icon: 'bar-chart',
      type: 'sub',
      Menusub: true,
      active: false,
      badgeValue: '6',
	  badgeClass: 'secondary',
      children: [
        {
          path: '/charts/chart-js',
          title: 'Chart Js',
          type: 'link',
          selected: false,
        },
        {
          path: '/charts/chartlist',
          title: 'Chartlist',
          type: 'link',
          selected: false,
        },
        {
          path: '/charts/echarts',
          title: 'ECharts',
          type: 'link',
          selected: false,
        },
        {
          path: '/charts/apex-charts',
          title: 'Apex Charts',
          type: 'link',
          selected: false,
        },
      ],
    },
    {
      title: 'Icons',
      selected: false,
      icon: 'wind',
      type: 'sub',
      Menusub: true,
      active: false,
      children: [
        {
          path: '/icons/font-awesome',
          title: 'Font Awesome',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/material-design-icons',
          title: 'Material Design Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/simple-line-icons',
          title: 'Simple Line Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/feathe-icons',
          title: 'Feather Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/ionic-icons',
          title: 'Ionic Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/flag-icons',
          title: 'Flag Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/pe7-icons',
          title: 'pe7 Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/themify-icons',
          title: 'Themify Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/typicons-icons',
          title: 'Typicons Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/weather-icons',
          title: 'Weather Icons',
          type: 'link',
          selected: false,
        },
        {
          path: '/icons/bootstrap-icons',
          title: 'Bootstrap Icons',
          type: 'link',
          selected: false,
        },
      ],
    },
  ];

  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
