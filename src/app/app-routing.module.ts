import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { content } from './shared/routes/routes';
import { ContentLayoutComponent } from './shared/layout-components/layout/content-layout/content-layout.component';

const routes: Routes = [
  { path: '', redirectTo:'auth/login', pathMatch: 'full'},
  {
    path:'', loadChildren: ()=> import('./authentication/authentication.module').then(m => m.AuthenticationModule),
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content
  },
  {
    path: '',
    loadChildren: () => import('./shared/shared.module').then(m => m.SharedModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AppRoutingModule { }
