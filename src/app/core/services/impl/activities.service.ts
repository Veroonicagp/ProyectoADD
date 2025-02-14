
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
  } /**Activity[] | Paginated<Activity> */

  // Implementa métodos específicos si los hay
  getAllByAdvenId(advenId: string, page: number, pageSize: number): Observable<Activity[] | Paginated<Activity>> {
    return this.repository.getAll(page, pageSize, {advenId: advenId})
    /** .pipe( map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null));*/
  }
}
