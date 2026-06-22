import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { LoginMainComponent } from './login-main/login-main.component';
import { NfsControlsModule } from '@NFS_Core/NFSControls/nfs-controls.module';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaModule } from "ng-recaptcha-2";

@NgModule({
  declarations: [LoginMainComponent],
  imports: [
    CommonModule,
    NfsControlsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    MatButtonModule
  ],
  exports: []
})
export class LoginModule { }
