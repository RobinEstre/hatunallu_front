import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlmacenRoutingModule } from './almacen-routing.module';
import { ProductosComponent } from './pages/productos/productos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';
import { ButtonsTableProductosComponent } from './pages/productos/buttons-table-productos/buttons-table-productos.component';
import { ReconsumosComponent } from './pages/reconsumos/reconsumos.component';
import { ButtonsTableReconsumoAlmacenComponent } from './pages/reconsumos/buttons-table-reconsumo-almacen/buttons-table-reconsumo-almacen.component';


@NgModule({
  declarations: [
    ProductosComponent,
    PerfilComponent,
    ButtonsTableProductosComponent,
    ReconsumosComponent,
    ButtonsTableReconsumoAlmacenComponent
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
    AlmacenRoutingModule
  ]
})
export class AlmacenModule { }
