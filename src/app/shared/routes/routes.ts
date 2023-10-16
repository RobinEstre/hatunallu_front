import { Routes } from '@angular/router';


export const content: Routes = [
  {
    path:'authentication',
    loadChildren: () => import('../../authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path:'panel',
    loadChildren: () => import('../../panel/panel.module').then(m => m.PanelModule)
  }
];
