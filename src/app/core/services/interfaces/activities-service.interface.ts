// src/app/services/interfaces/people.service.interface.ts
import { Activity } from '../../models/activity.model';
import { IBaseService } from './base-service.interface';

export interface IActivitiesService extends IBaseService<Activity> {
  // Métodos específicos si los hay
}
