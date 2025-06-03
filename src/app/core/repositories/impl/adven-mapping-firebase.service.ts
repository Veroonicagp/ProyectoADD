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
    return {
      name: data.name,
      surname: data.surname,
      email: data.email,
      userId: data.userId || '',
      media: data.media ? data.media.url : ''
    }
  }
  
  setUpdate(data: Partial<Adven>): any {
    const result: any = {};
    
    // Usar !== undefined para detectar campos que se quieren actualizar
    if (data.name !== undefined) result.name = data.name;
    if (data.surname !== undefined) result.surname = data.surname;
    if (data.email !== undefined) result.email = data.email;
    if (data.userId !== undefined) result.user = data.userId || '';
    
    // IMPORTANTE: Manejar media correctamente
    if (data.media !== undefined) {
      console.log('Procesando media en mapeo:', data.media, 'tipo:', typeof data.media);
      
      // Verificar si es null
      if (data.media === null) {
        result.media = '';
        console.log('Configurando media para eliminar (null)');
      }
      // Verificar si es string
      else if (typeof data.media === 'string') {
        const mediaString = data.media as string;
        if (mediaString.length === 0) {
          // String vacío - eliminar
          result.media = '';
          console.log('Configurando media para eliminar (string vacío)');
        } else {
          // URL válida
          result.media = mediaString;
          console.log('Configurando nueva media URL:', mediaString);
        }
      }
      // Verificar si es objeto
      else if (data.media && typeof data.media === 'object') {
        const mediaObject = data.media as any;
        if (mediaObject.url && mediaObject.url.length > 0) {
          result.media = mediaObject.url;
          console.log('Configurando media desde objeto URL:', mediaObject.url);
        } else {
          // Objeto sin URL válida, eliminar
          result.media = '';
          console.log('Objeto media sin URL válida, eliminando');
        }
      }
      // Cualquier otro caso
      else {
        result.media = '';
        console.log('Caso no manejado, eliminando media');
      }
    }
    
    console.log('Datos mapeados para Firebase:', result);
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