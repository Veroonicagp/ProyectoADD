// src/app/services/interfaces/people.service.interface.ts
import { Observable } from 'rxjs';
import { Adven } from '../../models/adven.model';
import { IBaseService } from './base-service.interface';

export interface IAdvenService extends IBaseService<Adven> {
  // Métodos específicos si los hay
  getByUserId(userId: string): Observable<Adven | null>;
}
