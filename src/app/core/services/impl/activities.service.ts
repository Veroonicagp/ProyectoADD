
import { Injectable, Inject } from '@angular/core';
import { BaseService } from './base-service.service';
import { ACTIVITIES_REPOSITORY_TOKEN } from '../../repositories/repository.tokens';
import { IActivitiesService } from '../interfaces/activities-service.interface';
import { Activity } from '../../models/activity.model';
import { IActivitiesRepository } from '../../repositories/intefaces/activities-repository.interface';
import { Observable, from, map, mergeMap } from 'rxjs';
import { DocumentData, Firestore, QueryConstraint, QueryDocumentSnapshot, collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { Paginated } from '../../models/paginated.model';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseService<Activity> implements IActivitiesService {
  private collectionRef;
  constructor(
    @Inject(ACTIVITIES_REPOSITORY_TOKEN) repository: IActivitiesRepository,
    private firestore: Firestore
    
    
  ) {
    super(repository);
    this.collectionRef = collection(this.firestore, 'activities');
  }
  private async getLastDocumentOfPreviousPage(advenId: string, page: number, pageSize: number): Promise<QueryDocumentSnapshot<DocumentData> | null> {
    if (page <= 1) return null;
    
    const q = query(
        this.collectionRef,
        where('advenId', '==', advenId),
        orderBy('title'),
        limit((page - 1) * pageSize)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs[snapshot.docs.length - 1];
}

  // Implementa métodos específicos si los hay
  getAllByAdvenId(advenId: string,page: number, pageSize: number): Observable<Paginated<Activity>>{
    return from(this.getLastDocumentOfPreviousPage(advenId, page, pageSize)).pipe(
      map(lastDoc => {
          const constraints: QueryConstraint[] = [
              where('advenId', '==', advenId),
              orderBy('title'),
              limit(pageSize)
          ];

          if (lastDoc) {
              constraints.push(startAfter(lastDoc));
          }

          return query(this.collectionRef, ...constraints);
      }),
      mergeMap(q => getDocs(q)),
      map(snapshot => {
          const activities = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                  id: doc.id,
                  title: data['title'],
                  location: data['location'],
                  price: data['price'],
                  description: data['description'],
                  advenId: data['advenId']
              } as Activity;
          });

          return {
              page: page,
              pageSize: pageSize,
              pages: Math.ceil(snapshot.size / pageSize),
              data: activities
          } as Paginated<Activity>;
      })
  );
  }



}
