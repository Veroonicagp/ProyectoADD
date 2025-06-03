import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { LoginPage } from './login.page';
import { PasswordEyeIconPipe } from 'src/app/shared/pipes/password-eye-icon.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    LoginPage,
    PasswordEyeIconPipe
  ]
})
export class LoginPageModule {}