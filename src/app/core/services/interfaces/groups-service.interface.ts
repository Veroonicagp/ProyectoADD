// src/app/services/interfaces/people.service.interface.ts
import { Group } from '../../models/activity.model';
import { Person } from '../../models/adven.model';
import { IBaseService } from './base-service.interface';

export interface IGroupsService extends IBaseService<Group> {
  // Métodos específicos si los hay
}
