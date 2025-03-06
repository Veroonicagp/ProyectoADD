import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityModalComponent } from './components/activity-modal/activity-modal.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PictureSelectableComponent } from './components/picture-selectable/picture-selectable.component';
import { PictureOptionsComponent } from './components/picture-options/picture-options.component';
import { ActivityInfoComponent } from './components/activity-info/activity-info.component';



@NgModule({
  declarations: [
    ActivityModalComponent,
    PictureSelectableComponent,
    PictureOptionsComponent,
    ActivityInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports:[
    ActivityModalComponent,
    PictureSelectableComponent,
    PictureOptionsComponent,
    ActivityInfoComponent

  ]
})
export class SharedModule { }
