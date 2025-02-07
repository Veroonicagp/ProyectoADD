import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { ACTIVITIES_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IActivitiesService } from '../interfaces/activities-service.interface';
import { Activity } from '../../models/activity.model';
import { IActivitiesRepository } from '../../repositories/intefaces/activities-repository.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseService<Activity> implements IActivitiesService {
  constructor(
    @Inject(ACTIVITIES_REPOSITORY_TOKEN) repository: IActivitiesRepository
  ) {
    super(repository);
  }

  getAllByAdvenId(advenId: string, page: number, pageSize: number): Observable<Activity | null> {
    return this.repository.getAll(page, pageSize, { user: advenId }).pipe(
      map(res => {
        const data = Array.isArray(res) ? res : res.data;
        return data.length > 0 ? data[0] : null;
      })
    );
  }
}
