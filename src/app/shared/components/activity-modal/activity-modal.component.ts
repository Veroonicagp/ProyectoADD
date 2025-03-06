import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Adven } from 'src/app/core/models/adven.model';
import { BaseMediaService } from 'src/app/core/services/impl/base-media.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent  implements OnInit {
  formGroup:FormGroup;
  mode:'new'|'edit' = 'new';
  isMobile: boolean = false;

  private  _activities:BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  public activities$:Observable<Activity[]> = this._activities.asObservable();
  
  @Input() set activities(activities:Activity[]){
    this._activities.next(activities);
  }

  @Input() set activity(_activities:Activity){
    if(_activities && _activities.id)
      this.mode = 'edit';
    
    this.formGroup.controls['title'].setValue(_activities.title);
    this.formGroup.controls['location'].setValue(_activities.location);
    this.formGroup.controls['price'].setValue(_activities.price);
    this.formGroup.controls['description'].setValue(_activities.description);
    this.formGroup.controls['media'].setValue(_activities.media?.url || _activities.media);
  }

  constructor(
    private fb:FormBuilder,
    private modalCtrl:ModalController,
    private mediaService:BaseMediaService,
    private toastController: ToastController,
    private translateService: TranslateService,
    private platform: Platform) {
      this.isMobile = this.platform.is('ios') || this.platform.is('android');
      this.formGroup = this.fb.group({
      title:['', [Validators.required, Validators.minLength(2)]],
      location:['', [Validators.required, Validators.minLength(2)]],
      price:['', [Validators.required]],
      description:['', [Validators.required,Validators.minLength(10)]],
      media:[''],
    });
     }

  ngOnInit() {}

  
  get title(){
    return this.formGroup.controls['title'];
  }

  get location(){
    return this.formGroup.controls['location'];
  }

  get price(){
    return this.formGroup.controls['price'];
  }

  get description(){
    return this.formGroup.controls['description'];
  }

  async getDirtyValues(formGroup: FormGroup): Promise<any> {
    const dirtyValues: any = {};
    try {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });

    if(dirtyValues.media){
      // Convertir base64 a Blob
      const base64Response = await fetch(dirtyValues.media);
      const blob = await base64Response.blob();
      const uploadedBlob = await lastValueFrom(this.mediaService.upload(blob));
      dirtyValues.media = uploadedBlob[0];
    } 
  
    return dirtyValues;
  }catch (error) {
    console.error(error);
    const toast = await this.toastController.create({
      message: await this.translateService.get('No se a podido actualizar').toPromise(),
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  } 
  }

  async onSubmit(){
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(
          (this.mode=='new'?
            this.formGroup.value:
            await this.getDirtyValues(this.formGroup)), this.mode
      );
    } else {
      console.log('Formulario inválido');
    }

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
