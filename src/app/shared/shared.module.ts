import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModalComponent } from './components/activity-modal/activity-modal.component';
import { LocationSelectableComponent } from './components/location-selectable/location-selectable.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PictureSelectableComponent } from './components/picture-selectable/picture-selectable.component';
import { PictureOptionsComponent } from './components/picture-options/picture-options.component';



@NgModule({
  declarations: [
    ActivityModalComponent,
    LocationSelectableComponent,
    PictureSelectableComponent,
    PictureOptionsComponent
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
    PictureSelectableComponent,
    PictureOptionsComponent

  ]
})
export class SharedModule { }
