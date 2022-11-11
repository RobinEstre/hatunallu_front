import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { OrdenVentaComponent } from './pages/orden-venta/orden-venta.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";


@NgModule({
  declarations: [
    OrdenVentaComponent,
    DashboardComponent
  ],
    imports: [
        CommonModule,
        VentasRoutingModule,
        ReactiveFormsModule,
        NgSelectModule,
        FormsModule
    ]
})
export class VentasModule { }
