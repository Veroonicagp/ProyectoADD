// src/app/services/impl/people.service.ts
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { ACTIVITIES_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IActivitiesService } from '../interfaces/activities-service.interface';
import { Activity } from '../../models/activity.model';
import { IActivitiesRepository } from '../../repositories/intefaces/activities-repository.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseService<Activity> implements IActivitiesService {
  constructor(
    @Inject(ACTIVITIES_REPOSITORY_TOKEN) repository: IActivitiesRepository
  ) {
    super(repository);
  }

  // Implementa métodos específicos si los hay

}
