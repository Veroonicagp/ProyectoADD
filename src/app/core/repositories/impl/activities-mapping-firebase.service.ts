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
      location: data.location,
      price: data.price,
      description: data.description,
      advenId: data.advenId,
      media: data.media ? {
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
    let dataMapping: FirebaseActivity = {
      title: data.title,
      location: data.location,
      price: data.price,
      description: data.description,
      advenId: data.advenId || '',
      media: data.media ? data.media.url : ''
    };
    return dataMapping;
  }

  setUpdate(data: Partial<Activity>): any {
    const result: any = {};
    
    if (data.title !== undefined) {
      result.title = data.title;
    }
    
    if (data.location !== undefined) {
      result.location = data.location;
    }
    
    if (data.price !== undefined) {
      result.price = data.price;
    }
    
    if (data.description !== undefined) {
      result.description = data.description;
    }
    
    if (data.advenId !== undefined) {
      result.advenId = data.advenId;
    }
    
    if (data.media !== undefined) {
      if (data.media === null) {
        result.media = '';
      } else if (typeof data.media === 'string') {
        const mediaString = data.media as string;
        if (mediaString.length === 0) {
          result.media = '';
        } else {
          result.media = mediaString;
        }
      } else if (data.media && typeof data.media === 'object') {
        const mediaObject = data.media as any;
        if (mediaObject.url && mediaObject.url.length > 0) {
          result.media = mediaObject.url;
        } else {
          result.media = '';
        }
      } else {
        result.media = '';
      }
    }
    
    return result;
  }

  getAdded(data: {id: string} & FirebaseActivity): Activity {
    return this.getOne(data);
  }

  getUpdated(data: {id: string} & FirebaseActivity): Activity {
    return this.getOne(data);
  }

  getDeleted(data: {id: string} & FirebaseActivity): Activity {
    return this.getOne(data);
  }
}