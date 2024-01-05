import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import { ReferidosComponent } from './pages/referidos/referidos.component';
import { RedComponent } from './pages/red/red.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ReconsumoComponent } from './pages/reconsumo/reconsumo.component';
import { ComisionesComponent } from './pages/comisiones/comisiones.component';
import { HReconsumoComponent } from './pages/h-reconsumo/h-reconsumo.component';
import { HComisionesComponent } from './pages/h-comisiones/h-comisiones.component';

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
  },
  {
    path: 'reconsumo',
    component: ReconsumoComponent
  },
  {
    path: 'historial-reconsumo',
    component: HReconsumoComponent
  },
  {
    path: 'historial-comisiones',
    component: ComisionesComponent
  },
  {
    path: 'comisiones',
    component: HComisionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PanelRoutingModule { }
