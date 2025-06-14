import { Observable } from 'rxjs';
import { Activity } from '../../models/activity.model';
import { IBaseService } from './base-service.interface';

export interface IActivitiesService extends IBaseService<Activity> {
  
  getAllActivitiesByAdvenId(advenId: string): Observable<Activity[]>
}
