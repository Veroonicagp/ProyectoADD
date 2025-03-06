
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { ACTIVITIES_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IActivitiesService } from '../interfaces/activities-service.interface';
import { Activity } from '../../models/activity.model';
import { IActivitiesRepository } from '../../repositories/intefaces/activities-repository.interface';
import { map, Observable } from 'rxjs';
import { Paginated } from '../../models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseService<Activity> implements IActivitiesService {
  constructor(
    @Inject(ACTIVITIES_REPOSITORY_TOKEN) repository: IActivitiesRepository
  ) {
    super(repository);
  } 

  getAllActivitiesByAdvenId(advenId: string): Observable<Activity[]> {
    return this.repository.getAll(1, 100, {advenId: advenId}).pipe(
      map(res => {
        if (Array.isArray(res)) {
          return res;
        }
        return res.data;
      })
    );
  }
}
