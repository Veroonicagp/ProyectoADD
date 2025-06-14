import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { ActivitiesMapComponent } from 'src/app/shared/components/activities-maps/activities-map.component';
import { ActivityInfoComponent } from 'src/app/shared/components/activity-info/activity-info.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {
  private _activities: BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  activities$: Observable<Activity[]> = this._activities.asObservable();
  
  private _filteredActivities: BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  filteredActivities$: Observable<Activity[]> = this._filteredActivities.asObservable();
  
  searchTerm: string = '';
  private allActivities: Activity[] = [];
  page: number = 1;
  pageSize: number = 25;

  constructor(
    private actSvc: ActivitiesService,
    private translate: TranslateService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.getMoreActivities();
  }

  getMoreActivities(notify: HTMLIonInfiniteScrollElement | null = null) {
    this.actSvc.getAll(this.page, this.pageSize).subscribe({
      next: (response: Paginated<Activity>) => {
        this.allActivities = [...this.allActivities, ...response.data];
        this._activities.next(this.allActivities);
        this.filterActivities();
        this.page++;
        notify?.complete();
      },
      error: (err) => {
        console.error('Error loading activities:', err);
        notify?.complete();
      }
    });
  }

  private normalizeLocation(location: string): string {
    return location
      .toLowerCase()
      .trim()
      .replace(/[áàâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòôö]/g, 'o')
      .replace(/[úùûü]/g, 'u');
  }

  async openLocationMap(location: string, clickedActivity?: Activity) {
    // Filtrar TODAS las actividades que coincidan con la ubicación
    const activitiesInLocation = this.allActivities.filter(activity => 
      this.normalizeLocation(activity.location) === this.normalizeLocation(location)
    );

    console.log(`Abriendo mapa para "${location}" con ${activitiesInLocation.length} actividades:`, 
                activitiesInLocation.map(a => a.title));

    const modal = await this.modalCtrl.create({
      component: ActivitiesMapComponent,
      componentProps: {
        activities: activitiesInLocation,
        location: location,
        highlightedActivity: clickedActivity
      },
      cssClass: 'map-modal'
    });
    
    await modal.present();
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  filterActivities() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this._filteredActivities.next(this.allActivities);
    } else {
      const normalizedSearchTerm = this.normalizeText(this.searchTerm);
      
      const filtered = this.allActivities.filter(activity => {
        const normalizedLocation = this.normalizeText(activity.location);
        return normalizedLocation.includes(normalizedSearchTerm);
      });
      
      this._filteredActivities.next(filtered);
    }
  }

  onSearchInput(event: any) {
    this.searchTerm = event.detail.value;
    this.filterActivities();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterActivities();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.getMoreActivities(ev.target);
  }

  async openActivityInfo(activity: Activity, index: number) {
    const modal = await this.modalCtrl.create({
      component: ActivityInfoComponent,
      componentProps: {
        activity
      },
      cssClass: 'activity-info-modal',
      backdropDismiss: true,
      showBackdrop: true,
      mode: 'ios',
      animated: true,
    });
    await modal.present();
  }
}