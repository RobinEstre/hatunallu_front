import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from '../../../../hemilia_frontend/src/app/authentication/login-page/login-page.component';
import { RegisterComponent } from '../../../../hemilia_frontend/src/app/authentication/register/register.component';

const routes: Routes = [
  {
    path: 'auth', children:[
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
