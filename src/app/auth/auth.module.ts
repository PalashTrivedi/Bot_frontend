import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from 'AuthPages/login/login.component';
import { RegisterComponent } from 'AuthPages/register/register.component';
import { AuthLayoutComponent } from 'AuthLayout/auth-layout.component';


@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    AuthRoutingModule,
    CommonModule,
    ReactiveFormsModule,

    MatCheckboxModule,
  ]
})
export class AuthModule { }
