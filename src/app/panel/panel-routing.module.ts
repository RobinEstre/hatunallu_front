import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import { ReferidosComponent } from './pages/referidos/referidos.component';
import { RedComponent } from './pages/red/red.component';
import { PerfilComponent } from './pages/perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'referidos',
    component: ReferidosComponent
  },
  {
    path: 'red',
    component: RedComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
