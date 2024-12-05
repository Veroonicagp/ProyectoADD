import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Adven } from 'src/app/core/models/adven.model';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent  implements OnInit {
  formGroup:FormGroup;
  person?: Adven | null;
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
  }

  
  constructor(
    private fb:FormBuilder,
    private modalCtrl:ModalController,
    private authSvc:BaseAuthenticationService,
    private advSvc:AdvenService,
    
    private platform: Platform) {
      this.isMobile = this.platform.is('ios') || this.platform.is('android');
      this.formGroup = this.fb.group({
        title:['', [Validators.required, Validators.minLength(2)]],
        location:['', [Validators.required, Validators.minLength(2)]],
        price:['', [Validators.required,Validators.minLength(2)]],
        description:['', [Validators.required,Validators.minLength(2)]],
        advenId: [null]
      });
      
      
     }

  async ngOnInit() {
    const user = await this.authSvc.getCurrentUser();
    const id = lastValueFrom(this.advSvc.getByUserId(user.id))
    

  }

  
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


  getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
  
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });
  
    return dirtyValues;
  }

  onSubmit(){
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(
          (this.mode=='new'?
            this.formGroup.value:
            this.getDirtyValues(this.formGroup)), this.mode
      );
    } else {
      console.log('Formulario inválido');
    }

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
