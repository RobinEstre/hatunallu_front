import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenRoutingModule } from './almacen-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EntradaMercanciaComponent } from './pages/entrada-mercancia/entrada-mercancia.component';
import {MatTableModule} from "@angular/material/table";
import {DataTablesModule} from "angular-datatables";
import {ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import { SalidaMercanciaComponent } from './pages/salida-mercancia/salida-mercancia.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';


@NgModule({
  declarations: [
    DashboardComponent,
    EntradaMercanciaComponent,
    SalidaMercanciaComponent,
    PedidosComponent
  ],
    imports: [
        CommonModule,
        AlmacenRoutingModule,
        MatTableModule,
        DataTablesModule,
        ReactiveFormsModule,
        NgSelectModule
    ]
})
export class AlmacenModule { }
