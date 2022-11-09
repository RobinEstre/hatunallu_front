import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenRoutingModule } from './almacen-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EntradaMercanciaComponent } from './pages/entrada-mercancia/entrada-mercancia.component';
import {MatTableModule} from "@angular/material/table";
import {DataTablesModule} from "angular-datatables";


@NgModule({
  declarations: [
    DashboardComponent,
    EntradaMercanciaComponent
  ],
    imports: [
        CommonModule,
        AlmacenRoutingModule,
        MatTableModule,
        DataTablesModule
    ]
})
export class AlmacenModule { }
