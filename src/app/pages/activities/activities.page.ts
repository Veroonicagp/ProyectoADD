import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from 'src/app/core/models/activity.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss'],
})
export class ActivitiesPage implements OnInit {

  _activities:BehaviorSubject<Activity[]> = new BehaviorSubject<Activity[]>([]);
  activities$:Observable<Activity[]>= this._activities.asObservable();

  constructor(
    private actSvc: ActivitiesService
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