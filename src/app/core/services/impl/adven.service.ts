
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { ADVEN_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { map, Observable } from 'rxjs';
import { Adven } from '../../models/adven.model';
import { IAdvenService } from '../interfaces/adven-service.interface';
import { IAdvenRepository } from '../../repositories/intefaces/adven-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class AdvenService extends BaseService<Adven> implements IAdvenService {
  constructor(
    @Inject(ADVEN_REPOSITORY_TOKEN) repository: IAdvenRepository
  ) {
    super(repository);
  }
  
  // Implementa métodos específicos si los hay
  getByUserId(userId: string): Observable<Adven | null> {
    return this.repository.getAll(1, 1, {userId: userId}).pipe(
      map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
    );
  }

  
}
