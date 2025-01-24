import { Component, Inject, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Adven } from 'src/app/core/models/adven.model';
import { Paginated } from 'src/app/core/models/paginated.model';
import { ADVEN_COLLECTION_SUBSCRIPTION_TOKEN } from 'src/app/core/repositories/repository.tokens';
import { ActivitiesService } from 'src/app/core/services/impl/activities.service';
import { AdvenService } from 'src/app/core/services/impl/adven.service';
import { ICollectionSubscription } from 'src/app/core/services/interfaces/collection-subcription.interface';
//del ultimo commit de juan de los submit falta actualizar esta paguina que corresponde a person 
@Component({
  selector: 'app-adventurous',
  templateUrl: './adventurous.page.html',
  styleUrls: ['./adventurous.page.scss'],
})
export class AdventurousPage implements OnInit {
  _advens:BehaviorSubject<Adven[]> = new BehaviorSubject<Adven[]>([]);
  advens$:Observable<Adven[]> = this._advens.asObservable();

  private loadedIds: Set<string> = new Set(); // Mantener registro de IDs cargados
  constructor(
    private advenSvc: AdvenService,
    private actSvc: ActivitiesService,
    @Inject(ADVEN_COLLECTION_SUBSCRIPTION_TOKEN) 
    private peopleSubscription: ICollectionSubscription<Adven>
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
