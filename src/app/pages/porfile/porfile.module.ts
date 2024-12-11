import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PorfilePageRoutingModule } from './porfile-routing.module';

import { PorfilePage } from './porfile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PorfilePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PorfilePage]
})
export class PorfilePageModule {}
