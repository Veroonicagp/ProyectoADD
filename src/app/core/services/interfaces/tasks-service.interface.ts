// src/app/services/interfaces/people.service.interface.ts
import { Task } from '../../models/activity.model';
import { IBaseService } from './base-service.interface';

export interface ITasksService extends IBaseService<Task> {
  // Métodos específicos si los hay
}
