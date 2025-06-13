import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { ADVEN_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { map, Observable, BehaviorSubject, tap } from 'rxjs';
import { Adven } from '../../models/adven.model';
import { IAdvenService } from '../interfaces/adven-service.interface';
import { IAdvenRepository } from '../../repositories/intefaces/adven-repository.interface';

@Injectable({
  providedIn: 'root'
})
export class AdvenService extends BaseService<Adven> implements IAdvenService {
  
  private _advenUpdated = new BehaviorSubject<boolean>(false);
  public advenUpdated$ = this._advenUpdated.asObservable();

  constructor(
    @Inject(ADVEN_REPOSITORY_TOKEN) repository: IAdvenRepository
  ) {
    super(repository);
  }

  getByUserId(userId: string): Observable<Adven | null> {
    return this.repository.getAll(1, 1, {userId: userId}).pipe(
      map(res => Array.isArray(res) ? res[0] || null : res.data[0] || null)
    );
  }

  override update(id: string, entity: Adven): Observable<Adven> {
    return super.update(id, entity).pipe(
      tap(() => {
        console.log('Notificando actualización de Adven');
        this._advenUpdated.next(true);
      })
    );
  }

  // Método para forzar actualización manual
  triggerUpdate() {
    this._advenUpdated.next(true);
  }
}