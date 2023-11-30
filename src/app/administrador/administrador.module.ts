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


@NgModule({
  declarations: [
    ListTodosComponent,
    PerfilComponent
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
