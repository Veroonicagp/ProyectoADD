import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdventurousPageRoutingModule } from './adventurous-routing.module';

import { AdventurousPage } from './adventurous.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdventurousPageRoutingModule
  ],
  declarations: [AdventurousPage]
})
export class AdventurousPageModule {}
