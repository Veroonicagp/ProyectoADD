import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MiActivitiesPageRoutingModule } from './mi-activities-routing.module';

import { MiActivitiesPage } from './mi-activities.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MiActivitiesPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [MiActivitiesPage]
})
export class MiActivitiesPageModule {}
