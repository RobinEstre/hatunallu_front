import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout-components/footer/footer.component';
import { HeaderComponent } from './layout-components/header/header.component';
import { ContentLayoutComponent } from './layout-components/layout/content-layout/content-layout.component';
import { ErrorLayoutComponent } from './layout-components/layout/error-layout/error-layout.component';
import { LandingpageLayoutComponent } from './layout-components/layout/landingpage-layout/landingpage-layout.component';
import { SwitcherLayoutComponent } from './layout-components/layout/switcher-layout/switcher-layout.component';
import { LoaderComponent } from './layout-components/loader/loader.component';
import { PageHeaderComponent } from './layout-components/page-header/page-header.component';
import { SidebarComponent } from './layout-components/sidebar/sidebar.component';
import { SwitcherComponent } from './layout-components/switcher/switcher.component';
import { TabToTopComponent } from './layout-components/tab-to-top/tab-to-top.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RightSidebarComponent } from './layout-components/right-sidebar/right-sidebar.component';
import { HeaderOneComponent } from './layout-components/header-one/header-one.component';
import { ElementCardHeaderComponent } from './layout-components/element-card-header/element-card-header.component';
import { AuthService } from './services/auth.service';
import {HoverEffectSidebarDirective} from "./directives/hover-effect-sidebar.directive";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};


@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ContentLayoutComponent,
    ErrorLayoutComponent,
    LandingpageLayoutComponent,
    SwitcherLayoutComponent,
    LoaderComponent,
    PageHeaderComponent,
    SidebarComponent,
    SwitcherComponent,
    TabToTopComponent,
    RightSidebarComponent,
    HeaderOneComponent,
    ElementCardHeaderComponent,
    HoverEffectSidebarDirective,
  ],
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
    PerfectScrollbarModule,
    ColorPickerModule,
    FormsModule,
    MatProgressBarModule,
    NgbModule,
  ],
  exports : [
    PageHeaderComponent,
    ElementCardHeaderComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers:[
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AuthService
  ]
})
export class SharedModule { }
