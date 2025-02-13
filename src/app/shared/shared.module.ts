import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModalComponent } from './components/activity-modal/activity-modal.component';
import { LocationSelectableComponent } from './components/location-selectable/location-selectable.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './components/map/map.component';



@NgModule({
  declarations: [
    ActivityModalComponent,
    LocationSelectableComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports:[
    ActivityModalComponent,
    LocationSelectableComponent,
    MapComponent
  ]
})
export class SharedModule { }
