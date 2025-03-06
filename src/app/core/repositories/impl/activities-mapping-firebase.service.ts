import { Inject, Injectable } from '@angular/core';
import { IBaseMapping } from '../intefaces/base-mapping.interface';
import { Activity } from '../../models/activity.model';
import { Paginated } from '../../models/paginated.model';
import { FirebaseActivity } from '../../models/firebase/firebase-activity.model';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FIREBASE_CONFIG_TOKEN } from '../repository.tokens';
import { initializeApp } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class ActivitiesMappingFirebaseService implements IBaseMapping<Activity> {
  private db: Firestore;
  constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
        this.db = getFirestore(initializeApp(firebaseConfig));
  }
  getOne(data: { id: string } & FirebaseActivity): Activity {
    return {
      id: data.id,
      title: data.title,
      location:data.location,
      price:data.price,
      description:data.description,
      advenId:data.advenId,
      media:data.media ? {
        url: data.media,
        large: data.media,
        medium: data.media,
        small: data.media,
        thumbnail: data.media
      } : undefined
    };
  }
  getPaginated(page: number, pageSize: number, pages: number, data: ({ id: string } & FirebaseActivity)[]): Paginated<Activity> {
    return {
      page,
      pageSize,
      pages,
      data: data.map(item => this.getOne(item))
    };
  }
  setAdd(data: Activity): FirebaseActivity {
    let dataMapping:FirebaseActivity = {
      title: data.title,
      location:data.location,
      price:data.price,
      description:data.description,
      advenId:data.advenId||'',
      media:data.media ? data.media.url : ''
    };
    return dataMapping;
  }
  setUpdate(data: Activity): FirebaseActivity {
    const result: any = {};

    if(data.title) result.title = data.title;
    if(data.location) result.location = data.location;
    if(data.price) result.price = data.price;
    if(data.description) result.description = data.description;
    if(data.advenId) result.adven = data.advenId || '';
    if(data.media) result.media = data.media ;

    return result;
  }
  getAdded(data:{id:string} & FirebaseActivity): Activity {
    return this.getOne(data);
  }
  getUpdated(data:{id:string} & FirebaseActivity): Activity {
    return this.getOne(data);
  }
  getDeleted(data:{id:string} & FirebaseActivity): Activity {
    return this.getOne(data);
  }
} 