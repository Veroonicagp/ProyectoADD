import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Adven } from 'src/app/core/models/adven.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { MyActivitiesFirebaseService } from 'src/app/core/services/my-activities-firebase.service';
import { MyActivitiesService } from 'src/app/core/services/my-activities.service';
import { ActivityModalComponent } from 'src/app/shared/components/activity-modal/activity-modal.component';

@Component({
  selector: 'app-mi-activities',
  templateUrl: './mi-activities.page.html',
  styleUrls: ['./mi-activities.page.scss'],
})
export class MiActivitiesPage implements OnInit {
  formGroup: FormGroup;
  adven?: Adven | null;
  userId: string = '1';

  _myActivities:BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  myActivities$:Observable<Activity[]> = this._myActivities.asObservable();
  filteredActivities: Observable<Activity[]> = this.myActivities$;
  searchTerm: string = '';


  
  constructor(
    private formBuilder: FormBuilder,
    private actSvc: ActivitiesService,
    private modalCtrl:ModalController,
    private alertCtrl: AlertController,
    //private translateService: TranslateService,
    private loadingController: LoadingController,

  ) {
    this.formGroup = this.formBuilder.group({
    title:['', [Validators.required, Validators.minLength(2)]],
    location:['', [Validators.required, Validators.minLength(2)]],
    price:['', [Validators.required,Validators.minLength(2)]],
    description:['', [Validators.required,Validators.minLength(2)]],
    advenId:['',[Validators.required]]
  }); }

  selectedActivity: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;

  
  

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.getMoreActivities();


  }

  getMoreActivities(notify:HTMLIonInfiniteScrollElement | null = null) {
    if (this.adven?.id) {
    this.actSvc.getAllByAdvenId(this.adven.id,this.page, this.pageSize,).subscribe({
      next:(response:Paginated<Activity>)=>{
        this._myActivities.next([...this._myActivities.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }
  }


  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

  refresh(){
    console.log('Adven ID:', this.adven?.id); 
    if (this.adven?.id) {
      this.page = 1; // Reinicia la paginación
      this.actSvc.getAllByAdvenId(this.adven.id, this.page, this.pageSize).subscribe((response: Paginated<Activity>) => {
        console.log(response.data); 
        this._myActivities.next(response.data); // Actualiza las actividades mostradas
      });
    }
  }



  async openActivityDetail(activity: any, index: number) {
    await this.presentModalActivity('edit', activity);
    this.selectedActivity = activity;
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMoreActivities(ev.target);
  }

  private async presentModalActivity(mode:'new'|'edit', activity:Activity|undefined=undefined){
    const modal = await this.modalCtrl.create({
      component:ActivityModalComponent,
      componentProps:(mode=='edit'?{
        activity: activity, advenId:this.adven?.id
      }:{advenId:this.adven?.id})
    });
    modal.onDidDismiss().then((response:any)=>{
      switch (response.role) {
        case 'new':
          const newActivity = { ...response.data, advenId: this.adven?.id }; // userId dentro de adven
          this.actSvc.add(newActivity).subscribe({
            next:res=>{
              this.refresh();
            },
            error:err=>{}
          });
          break;
        case 'edit':
          console.log('Datos enviados:', response.data);
          console.log('ID de actividad:', activity!.id);
          
          const updatedData = { ...activity, ...response.data};
          console.log('Datos enviados al backend:',activity!.id,response.data);
          this.actSvc.update(activity!.id,response.data).subscribe({
            next:res=>{
              this.refresh();
            },
            error:err=>{}
          });
          break;
        default:
          break;
      }
    });
    await modal.present();
  } 

  async onAddActivity(){
    await this.presentModalActivity('new');
  }

  async presentAlert(activity:Activity) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: 'Desea eliminar a esta actividad permanentemente',
      buttons: [ {
        text: 'Confirmar',
        htmlAttributes: {
          'aria-label': 'close',
        },
        handler: () =>{
          this.actSvc.delete(activity.id).subscribe({
            next:res=>{
              this.refresh();
            },
            error:err=>{}
          });
        }
      },
      {
        text: 'Salir',
        htmlAttributes: {
          'aria-label': 'close',
        },
      },
    ],
    });

    await alert.present();
  }
}
