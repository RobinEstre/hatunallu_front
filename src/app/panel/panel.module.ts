import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PanelRoutingModule } from './panel-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReferidosComponent } from './pages/referidos/referidos.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RedComponent } from './pages/red/red.component';
import { D3OrgChartComponent } from './pages/red/d3-org-chart/d3-org-chart.component';
import { PerfilComponent } from './pages/perfil/perfil.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ReferidosComponent,
    RedComponent,
    D3OrgChartComponent,
    PerfilComponent
  ],
  imports: [
    CommonModule,
    NgCircleProgressModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxSpinnerModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
