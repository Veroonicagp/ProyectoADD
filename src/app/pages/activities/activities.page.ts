import { Component, Inject, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ACTIVITIES_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subcription.interface';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  _activities:BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  activities$:Observable<Activity[]>= this._activities.asObservable();
  filteredActivities: Observable<Activity[]> = this.activities$;
  searchTerm: string = '';
  
  filterActivities() {
    const filtered = this._activities.value.filter(activity =>
      activity.location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredActivities = new BehaviorSubject<Activity[]>(filtered).asObservable();
  }

  constructor(
    private actSvc: ActivitiesService,
    private translate: TranslateService,


  ) { }

  ngOnInit() {
    this.getMoreActivities();
  }

  selectedGroup: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;

  getMoreActivities(notify:HTMLIonInfiniteScrollElement | null = null) {
    this.actSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Activity>)=>{
        this._activities.next([...this._activities.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMoreActivities(ev.target); 
  }

}