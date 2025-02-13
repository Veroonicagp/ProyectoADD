import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Adven } from 'src/app/core/models/adven.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { AdvenService } from 'src/app/core/services/impl/adven.service';

@Component({
  selector: 'app-adventurous',
  templateUrl: './adventurous.page.html',
  styleUrls: ['./adventurous.page.scss'],
})
export class AdventurousPage implements OnInit {
  _advens:BehaviorSubject<Adven[]> = new BehaviorSubject<Adven[]>([]);
  advens$:Observable<Adven[]> = this._advens.asObservable();

  constructor(
    private advenSvc: AdvenService,
    private actSvc: ActivitiesService,
  ) { }

  ngOnInit() {
    this.getMoreAdvens();
  }
  selectedGroup: any = null;
  isAnimating = false;
  page:number = 1;
  pageSize:number = 25;

  getMoreAdvens(notify:HTMLIonInfiniteScrollElement | null = null) {
    this.advenSvc.getAll(this.page, this.pageSize).subscribe({
      next:(response:Paginated<Adven>)=>{
        this._advens.next([...this._advens.value, ...response.data]);
        this.page++;
        notify?.complete();
      }
    });
  }

  onIonInfinite(ev:InfiniteScrollCustomEvent) {
    this.getMoreAdvens(ev.target); 
  }

}
