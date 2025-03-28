
import { Observable } from 'rxjs';
import { Activity } from '../../models/activity.model';
import { IBaseService } from './base-service.interface';
import { Paginated } from '../../models/paginated.model';

export interface IActivitiesService extends IBaseService<Activity> {
  // Métodos específicos si los hay
  getAllActivitiesByAdvenId(advenId: string): Observable<Activity[]>
}
