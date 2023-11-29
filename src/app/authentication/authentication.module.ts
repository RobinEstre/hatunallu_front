import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RegisterLinkComponent } from './pages/register-link/register-link.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RecoverPasswordComponent } from './pages/recover-password/recover-password.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    RegisterComponent,
    RegisterLinkComponent,
    RecoverPasswordComponent
  ],
  imports: [
    NgSelectModule,
    NgxDropzoneModule,
    NgxSpinnerModule,
    CommonModule,
    AuthenticationRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
  ],
  providers: [

  ]
})
export class AuthenticationModule { }
