import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AlertController, AnimationController, InfiniteScrollCustomEvent, ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { MyActivitiesService } from 'src/app/core/services/my-activities.service';
import { ActivityModalComponent } from 'src/app/shared/components/activity-modal/activity-modal.component';

@Component({
  selector: 'app-mi-activities',
  templateUrl: './mi-activities.page.html',
  styleUrls: ['./mi-activities.page.scss'],
})
export class MiActivitiesPage implements OnInit {

  _activities:BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  activities$:Observable<Activity[]> = this._activities.asObservable();

  constructor(
    private myActSvc: MyActivitiesService

  ) { }

  selectedActivity: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;

  
  

  ngOnInit() {
  }


/**
 * 
 * 
  @ViewChildren('avatar') avatars!: QueryList<ElementRef>;
  @ViewChild('animatedAvatar') animatedAvatar!: ElementRef;
  @ViewChild('animatedAvatarContainer') animatedAvatarContainer!: ElementRef;

 * refresh(){
    this.page=1;
    this.actSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Activity>)=>{
        this._activities.next([...response.data]);
        this.page++;
      }
    });
  }

  getMoreActivity(notify:HTMLIonInfiniteScrollElement | null = null) {
    this.actSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Activity>)=>{
        this._activities.next([...this._activities.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }

  async openActivityDetail(activity: any, index: number) {
    /**await this.presentModalActivity('edit', activity);
    this.selectedActivity = activity;
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMoreActivity(ev.target);
    
  }

  private async presentModalActivity(mode:'new'|'edit', activity:Activity|undefined=undefined){
    const modal = await this.modalCtrl.create({
      component:ActivityModalComponent,
      componentProps:(mode=='edit'?{
        activity: activity
      }:{})
    });
    modal.onDidDismiss().then((response:any)=>{
      switch (response.role) {
        case 'new':
          this.actSvc.add(response.data).subscribe({
            next:res=>{
              this.refresh();
            },
            error:err=>{}
          });
          break;
        case 'edit':
          this.actSvc.update(activity!.id, response.data).subscribe({
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
    /**await this.presentModalActivity('new');
  }

  async presentAlert(activity:Activity) {
    const alert = await this.alertController.create({
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
  }**/
}
