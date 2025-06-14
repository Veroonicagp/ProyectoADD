import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserManagementPageRoutingModule } from './user-management-routing.module';
import { UserManagementPage } from './user-management.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserManagementPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [UserManagementPage]
})
export class UserManagementPageModule {}