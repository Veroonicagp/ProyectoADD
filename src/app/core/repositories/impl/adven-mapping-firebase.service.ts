import { Inject, Injectable } from "@angular/core";
import { IBaseMapping } from "../intefaces/base-mapping.interface";
import { Paginated } from "../../models/paginated.model";
import { Adven } from "../../models/adven.model";
import { doc, DocumentReference, Firestore, getFirestore } from "firebase/firestore";
import { FIREBASE_CONFIG_TOKEN } from "../repository.tokens";
import { initializeApp } from "firebase/app";
import { FirebaseAdven } from '../../models/firebase/firebase-adven.model';

@Injectable({
  providedIn: 'root'
})
export class AdvenMappingFirebaseService implements IBaseMapping<Adven> {

  private db: Firestore;

  constructor(@Inject(FIREBASE_CONFIG_TOKEN) protected firebaseConfig: any){
        this.db = getFirestore(initializeApp(firebaseConfig));
  }

  setAdd(data: Adven): FirebaseAdven {
    let dataMapping:FirebaseAdven = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      userId: data.userId || '',
      media: data.media ? data.media.url : ''
    };
    return dataMapping;
  }

  setUpdate(data: Partial<Adven>): FirebaseAdven {
    const result: any = {};
    if (data.name) result.name = data.name;
    if (data.surname) result.surname = data.surname;
    if (data.email) result.email = data.email;
    if (data.media) result.media = data.media.url;

    return result;
  }

  getOne(data: { id: string } & FirebaseAdven): Adven {
    return {
      id: data.id,
      name: data.name,
      surname: data.surname,
      email: data.email,
      userId: data.userId || '',
      media: data.media ? {
        url: data.media,
        large: data.media,
        medium: data.media,
        small: data.media,
        thumbnail: data.media
      } : undefined
    };
  }

  getPaginated(page: number, pageSize: number, total: number, data: ({id:string} & FirebaseAdven)[]): Paginated<Adven> {
    return {
      page,
      pageSize,
      pages: Math.ceil(total / pageSize),
      data: data.map(item => this.getOne(item))
    };
  }

  getAdded(data: {id:string} & FirebaseAdven): Adven {
    return this.getOne(data);
  }

  getUpdated(data: {id:string} & FirebaseAdven): Adven {
    return this.getOne(data);
  }

  getDeleted(data: {id:string} & FirebaseAdven): Adven {
    return this.getOne(data);
  }
} 