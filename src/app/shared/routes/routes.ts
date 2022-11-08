import { Routes } from '@angular/router';
import {AlmacenModule} from "../../almacen/almacen.module";


export const content: Routes = [
  {
    path:'authentication',
    loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path:'almacen',
    loadChildren: () => import('../../almacen/almacen.module').then(m => m.AlmacenModule)
  }
];
