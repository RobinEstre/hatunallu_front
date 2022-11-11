import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path:'authentication',
    loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path:'almacen',
    loadChildren: () => import('../../almacen/almacen.module').then(m => m.AlmacenModule)
  },
  {
    path:'venta',
    loadChildren: () => import('../../ventas/ventas.module').then(m => m.VentasModule)
  }
];
