import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityModalComponent } from './components/activity-modal/activity-modal.component';
import { PictureSelectableComponent } from './components/picture-selectable/picture-selectable.component';
import { PictureOptionsComponent } from './components/picture-options/picture-options.component';
import { ActivityInfoComponent } from './components/activity-info/activity-info.component';
import { CameraModalComponent } from './components/camera-modal/camera-modal.component';
import { AdvenActivitiesModalComponent } from './components/adven-activities-modal/adven-activities-modal.component';
import { ActivitiesMapComponent } from './components/activities-maps/activities-map.component';
import { HighlightHoverDirective } from './directive/high-light-hover.directive';
import { PasswordEyeIconPipe } from './pipes/password-eye-icon.pipe';
import { LanguageIconPipe, LanguageIonicIconPipe } from './pipes/language-icon.pipe';

@NgModule({
  declarations: [
    ActivityModalComponent,
    PictureSelectableComponent,
    PictureOptionsComponent,
    ActivityInfoComponent,
    CameraModalComponent,
    AdvenActivitiesModalComponent,
    ActivitiesMapComponent,
    HighlightHoverDirective,
    PasswordEyeIconPipe,
    LanguageIconPipe,
    LanguageIonicIconPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  exports: [
    ActivityModalComponent,
    PictureSelectableComponent,
    PictureOptionsComponent,
    ActivityInfoComponent,
    CameraModalComponent,
    AdvenActivitiesModalComponent,
    ActivitiesMapComponent,
    HighlightHoverDirective,
    PasswordEyeIconPipe,
    LanguageIconPipe,
    LanguageIonicIconPipe 
  ]
})
export class SharedModule { }