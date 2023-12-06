import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../panel/pages/dashboard/dashboard.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ReconsumosComponent } from './pages/reconsumos/reconsumos.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'productos',
    component: ProductosComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'reconsumos',
    component: ReconsumosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
