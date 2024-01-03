import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { ListTodosComponent } from './pages/list-todos/list-todos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { ButtonsTableReferidosComponent } from './pages/list-todos/buttons-table-referidos/buttons-table-referidos.component';
import { ReconsumosComponent } from './pages/reconsumos/reconsumos.component';
import { ButtonsTableReconsumosComponent } from './pages/reconsumos/buttons-table-reconsumos/buttons-table-reconsumos.component';
import { CambioReferidoComponent } from './pages/cambio-referido/cambio-referido.component';
import { HMesComponent } from './pages/h-mes/h-mes.component';
import { AfiliadosComponent } from './pages/h-mes/afiliados/afiliados.component';
import { HPagosComponent } from './pages/h-pagos/h-pagos.component';


@NgModule({
  declarations: [
    ListTodosComponent,
    PerfilComponent,
    ButtonsTableReferidosComponent,
    ReconsumosComponent,
    ButtonsTableReconsumosComponent,
    CambioReferidoComponent,
    HMesComponent,
    AfiliadosComponent,
    HPagosComponent
  ],
  imports: [
    CommonModule,
    NgxDropzoneModule,
    NgbModule,
    NgCircleProgressModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgxSpinnerModule,
    NgSelectModule,
    AdministradorRoutingModule
  ]
})
export class AdministradorModule { }
