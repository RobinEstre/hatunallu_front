import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {EntradaMercanciaComponent} from "./pages/entrada-mercancia/entrada-mercancia.component";
import {PedidosComponent} from "./pages/pedidos/pedidos.component";
import {SalidaMercanciaComponent} from "./pages/salida-mercancia/salida-mercancia.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'entrada',
        component: EntradaMercanciaComponent
      },
      {
        path: 'salida',
        component: SalidaMercanciaComponent
      },
      {
        path: 'pedidos',
        component: PedidosComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlmacenRoutingModule { }
