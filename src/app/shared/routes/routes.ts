import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path:'panel',
    loadChildren: () => import('../../panel/panel.module').then(m => m.PanelModule)
  },
  {
    path:'admin',
    loadChildren: () => import('../../administrador/administrador.module').then(m => m.AdministradorModule)
  },
  {
    path:'almacen',
    loadChildren: () => import('../../almacen/almacen.module').then(m => m.AlmacenModule)
  },
];
