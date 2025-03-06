import { Component, Inject, OnInit } from '@angular/core';
import { AlertController, InfiniteScrollCustomEvent, LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { ACTIVITIES_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { CollectionChange, ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subcription.interface';
import { ActivityModalComponent } from 'src/app/shared/components/activity-modal/activity-modal.component';

@Component({
  selector: 'app-mi-activities',
  templateUrl: './mi-activities.page.html',
  styleUrls: ['./mi-activities.page.scss'],
})
export class MiActivitiesPage implements OnInit {
  private _myActivities = new BehaviorSubject<Activity[]>([]);
  myActivities$ = this._myActivities.asObservable();
  private loadedIds: Set<string> = new Set(); 
  
  page = 1;
  pageSize = 25;
  advenId?: string;

  constructor(
    private actSvc: ActivitiesService,
    private authSvc: BaseAuthenticationService,
    private advenSvc: AdvenService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,

    @Inject(ACTIVITIES_COLLECTION_SUBSCRIPTION_TOKEN)
    private activitySubcrition: ICollectionSubscription<Activity>
  ) { }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    try {
      const user = await this.authSvc.getCurrentUser();
      if (user) {
        const adven = await lastValueFrom(this.advenSvc.getByUserId(user.id));
        if (adven) {
          this.advenId = adven.id;
          this.refresh();
        }
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      await loading.dismiss();
    }

    this.activitySubcrition.subscribe('activities').subscribe((change: CollectionChange<Activity>) => {
      const currentActivities = [...this._myActivities.value];
      
      // Solo procesar cambios de documentos que ya tenemos cargados
      if (!this.loadedIds.has(change.id) && change.type !== 'added') {
        return;
      }

      switch(change.type) {
        case 'added':
          if (!this.loadedIds.has(change.id)) {
            currentActivities.push(change.data!);
            this.loadedIds.add(change.id);
          }
          break;
        
        case 'modified':
          const index = currentActivities.findIndex(p => p.id === change.id);
          if (index >= 0) {
            currentActivities[index] = change.data!;
          }
          break;
        case 'removed':
          const removeIndex = currentActivities.findIndex(p => p.id === change.id);
          if (removeIndex >= 0) {
            currentActivities.splice(removeIndex, 1);
            this.loadedIds.delete(change.id);
          }
          break;
      }
      
      this._myActivities.next(currentActivities);
    });
  }

  refresh() {
    if (this.advenId) {
      this.actSvc.getAllActivitiesByAdvenId(this.advenId).subscribe(activities => {
        if (activities) {
          activities.forEach(activity => this.loadedIds.add(activity.id));
          this._myActivities.next(activities);
        }
      });
    }
  }

  getMoreActivities(notify: HTMLIonInfiniteScrollElement | null = null) {
    if (this.advenId) {
      this.actSvc.getAllActivitiesByAdvenId(this.advenId).subscribe({
        next: (activities) => {
          console.log(activities);
          activities.forEach(activity => this.loadedIds.add(activity.id));
          if (activities) {
            const currentActivities = this._myActivities.value;
            const newActivities = activities.filter(
              activity => !currentActivities.some(current => current.id === activity.id)
            );
            
            if (newActivities.length > 0) {
              this._myActivities.next([...currentActivities, ...newActivities]);
              this.page++;
            }
          }
          notify?.complete();
        },
        error: (err) => {
          console.error('Error loading more activities:', err);
          notify?.complete();
        }
      });
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMoreActivities(ev.target);
  }

  async openActivityDetail(activity: Activity, index: number) {
    const modal = await this.modalCtrl.create({
      component: ActivityModalComponent,
      componentProps: {
        activity,
        advenId: this.advenId
      }
    });

    modal.onDidDismiss().then((response) => {
      if (response.role === 'edit' && response.data) {
        this.actSvc.update(activity.id, response.data).subscribe({
          next: () => this.refresh(),
          error: (err) => console.error('Error updating activity:', err)
        });
      }
    });

    await modal.present();
  }

  async onAddActivity() {
    const modal = await this.modalCtrl.create({
      component: ActivityModalComponent,
      componentProps: {
        advenId: this.advenId
      }
    });
    
    modal.onDidDismiss().then((response) => {
      if (response.role === 'new' && response.data) {
        const newActivity = { ...response.data, advenId: this.advenId };
        
        if (newActivity.media && typeof newActivity.media !== 'object') {
          newActivity.media = {
            url: newActivity.media,
            large: newActivity.media,
            medium: newActivity.media,
            small: newActivity.media,
            thumbnail: newActivity.media
          };
        }
        
        this.actSvc.add(newActivity).subscribe({
          next: () => this.refresh(),
          error: (err) => console.error('Error adding activity:', err)
        });
      }
    });
    await modal.present();
  }

  async presentAlert(activity: Activity) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: '¿Desea eliminar esta actividad permanentemente?',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.actSvc.delete(activity.id).subscribe({
              next: () => this.refresh(),
              error: (err) => console.error('Error deleting activity:', err)
            });
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}