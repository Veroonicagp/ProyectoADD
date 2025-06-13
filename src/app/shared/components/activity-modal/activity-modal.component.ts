import { Component, Input, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent implements OnInit {
  formGroup: FormGroup;
  mode: 'new' | 'edit' = 'new';
  isMobile: boolean = false;
  private originalActivity?: Activity;
  
  @Input() advenId?: string;

  private _activities: BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  public activities$: Observable<Activity[]> = this._activities.asObservable();
  
  @Input() set activities(activities: Activity[]) {
    this._activities.next(activities);
  }

  @Input() set activity(_activity: Activity) {
    if (_activity && _activity.id) {
      this.mode = 'edit';
      this.originalActivity = { ..._activity };
    }
    
    this.formGroup.controls['title'].setValue(_activity.title);
    this.formGroup.controls['location'].setValue(_activity.location);
    this.formGroup.controls['price'].setValue(_activity.price);
    this.formGroup.controls['description'].setValue(_activity.description);
    this.formGroup.controls['media'].setValue(_activity.media?.url || _activity.media);
    
    this.formGroup.markAsPristine();
  }

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private mediaService: BaseMediaService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private platform: Platform,
    private activitiesService: ActivitiesService
  ) {
    this.isMobile = this.platform.is('ios') || this.platform.is('android');
    this.formGroup = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      location: ['', [Validators.required, Validators.minLength(2)]],
      price: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      media: ['assets/imgs/aventura.png'],
    });
  }

  ngOnInit() {}

  async onImageChanged() {
    if (this.mode === 'edit' && this.originalActivity) {
      try {
        const changedValues = await this.getChangedValues();
        
        if ('media' in changedValues) {
          this.activitiesService.update(this.originalActivity.id, changedValues).subscribe({
            next: (updatedActivity) => {
              this.originalActivity = { ...this.originalActivity, ...updatedActivity };
              this.showSuccessToast('Imagen actualizada correctamente');
            },
            error: (error) => {
              console.error('Error actualizando imagen:', error);
              this.showErrorToast('Error al actualizar la imagen');
            }
          });
        }
      } catch (error) {
        console.error('Error en actualización automática:', error);
        this.showErrorToast('Error procesando la imagen');
      }
    }
  }

  private async showSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  private async showErrorToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }

  get title() {
    return this.formGroup.controls['title'];
  }

  get location() {
    return this.formGroup.controls['location'];
  }

  get price() {
    return this.formGroup.controls['price'];
  }

  get description() {
    return this.formGroup.controls['description'];
  }

  async getChangedValues(): Promise<any> {
    if (this.mode === 'new') {
      const values = this.formGroup.value;
      
      if (values.media && values.media.startsWith('data:')) {
        const base64Response = await fetch(values.media);
        const blob = await base64Response.blob();
        const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
        values.media = uploadedBlob[0];
      }
      
      return values;
    } else {
      const formValues = this.formGroup.value;
      const changedValues = {} as any;

      if (formValues.title !== this.originalActivity?.title) {
        changedValues.title = formValues.title;
      }
      
      if (formValues.location !== this.originalActivity?.location) {
        changedValues.location = formValues.location;
      }
      
      if (formValues.price !== this.originalActivity?.price) {
        changedValues.price = formValues.price;
      }
      
      if (formValues.description !== this.originalActivity?.description) {
        changedValues.description = formValues.description;
      }

      const currentMedia = formValues.media || '';
      const originalMedia = this.originalActivity?.media?.url || this.originalActivity?.media || '';

      if (currentMedia !== originalMedia) {
        changedValues.media = currentMedia;
      }

      if ('media' in changedValues) {
        const mediaValue = changedValues.media;
        
        if (!mediaValue || mediaValue === '' || mediaValue === 'assets/imgs/aventura.png') {
          changedValues.media = 'assets/imgs/aventura.png';
        } else if (mediaValue.startsWith('data:')) {
          const base64Response = await fetch(mediaValue);
          const blob = await base64Response.blob();
          const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
          changedValues.media = uploadedBlob[0];
        }
      }

      return changedValues;
    }
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      try {
        const dataToReturn = await this.getChangedValues();
        this.modalCtrl.dismiss(dataToReturn, this.mode);
      } catch (error) {
        console.error('Error procesando datos:', error);
        const toast = await this.toastController.create({
          message: 'Error procesando la imagen',
          duration: 3000,
          position: 'bottom'
        });
        await toast.present();
      }
    } else {
      console.log('Formulario inválido');
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}