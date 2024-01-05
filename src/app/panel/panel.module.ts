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
import { NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ReconsumoComponent } from './pages/reconsumo/reconsumo.component';
import { ComisionesComponent } from './pages/comisiones/comisiones.component';
import { HReconsumoComponent } from './pages/h-reconsumo/h-reconsumo.component';
import { DataTablesModule } from 'angular-datatables';
import { TableButtonsComponent } from './pages/h-reconsumo/table-buttons/table-buttons.component';
import { ButtonsTableReconsumoComponent } from './pages/reconsumo/buttons-table-reconsumo/buttons-table-reconsumo.component';
import { HComisionesComponent } from './pages/h-comisiones/h-comisiones.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ReferidosComponent,
    RedComponent,
    D3OrgChartComponent,
    PerfilComponent,
    ReconsumoComponent,
    ComisionesComponent,
    HReconsumoComponent,
    TableButtonsComponent,
    ButtonsTableReconsumoComponent,
    HComisionesComponent
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    NgbModule,
    NgCircleProgressModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DataTablesModule,
    NgxSpinnerModule,
    PanelRoutingModule
  ]
})
export class PanelModule { }
