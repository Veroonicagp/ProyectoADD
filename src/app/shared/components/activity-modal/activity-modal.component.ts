import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Adven } from 'src/app/core/models/adven.model';

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

  @Input() set adven(_adven:Adven){
    if(_adven && _adven.id)
      this.mode = 'edit';
    
    this.formGroup.controls['name'].setValue(_adven.name);
    this.formGroup.controls['surname'].setValue(_adven.surname);
    this.formGroup.controls['email'].setValue(_adven.email);
    
  }

  constructor(
    private fb:FormBuilder,
    private modalCtrl:ModalController,
    private platform: Platform) {
      this.isMobile = this.platform.is('ios') || this.platform.is('android');
      this.formGroup = this.fb.group({
      name:['', [Validators.required, Validators.minLength(2)]],
      surname:['', [Validators.required, Validators.minLength(2)]],
      email:['', [Validators.required, Validators.email]],
    });
     }

  ngOnInit() {}

  
  get name(){
    return this.formGroup.controls['name'];
  }

  get surname(){
    return this.formGroup.controls['surname'];
  }

  get age(){
    return this.formGroup.controls['age'];
  }

  get email(){
    return this.formGroup.controls['email'];
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
