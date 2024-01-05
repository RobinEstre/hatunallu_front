import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTodosComponent } from './pages/list-todos/list-todos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DashboardComponent } from '../panel/pages/dashboard/dashboard.component';
import { ReconsumosComponent } from './pages/reconsumos/reconsumos.component';
import { CambioReferidoComponent } from './pages/cambio-referido/cambio-referido.component';
import { HMesComponent } from './pages/h-mes/h-mes.component';
import { HPagosComponent } from './pages/h-pagos/h-pagos.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'listar-todos',
    component: ListTodosComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'reconsumos',
    component: ReconsumosComponent
  },
  {
    path: 'cambio-referido',
    component: CambioReferidoComponent
  },
  {
    path: 'historial-ventas',
    component: HMesComponent
  },
  {
    path: 'historial-pagos',
    component: HPagosComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministradorRoutingModule { }
