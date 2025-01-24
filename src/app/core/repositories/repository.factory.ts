// src/app/repositories/repository.factory.ts
import { FactoryProvider, InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryHttpService } from './impl/base-repository-http.service';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { Adven } from '../models/adven.model';
import { AUTH_MAPPING_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, ACTIVITIES_API_URL_TOKEN, ACTIVITIES_REPOSITORY_MAPPING_TOKEN, ACTIVITIES_REPOSITORY_TOKEN, ACTIVITIES_RESOURCE_NAME_TOKEN, ADVEN_API_URL_TOKEN, ADVEN_REPOSITORY_MAPPING_TOKEN, ADVEN_REPOSITORY_TOKEN, ADVEN_RESOURCE_NAME_TOKEN, UPLOAD_API_URL_TOKEN, FIREBASE_CONFIG_TOKEN, ADVEN_COLLECTION_SUBSCRIPTION_TOKEN, ACTIVITIES_COLLECTION_SUBSCRIPTION_TOKEN } from './repository.tokens';
import { BaseRespositoryLocalStorageService } from './impl/base-repository-local-storage.service';
import { Model } from '../models/base.model';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { FirebaseMediaService } from '../services/impl/firebase-media.service';
import { JsonServerRepositoryService } from './impl/json-server-repository.service';
import { Activity } from '../models/activity.model';
import { StrapiRepositoryService } from './impl/strapi-repository.service';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { IAuthMapping } from '../services/interfaces/auth-mapping.interface';
import { StrapiAuthenticationService } from '../services/impl/strapi-authentication.service';
import { AdvenLocalStorageMapping } from './impl/adven-mapping-local-storage.service';
import { AdvenMappingJsonServer } from './impl/adven-mapping-json-server.service';
import { AdvenMappingStrapi } from './impl/adven-mapping-strapi.service';
import { StrapiAuthMappingService } from '../services/impl/strapi-auth-mapping.service';
import { ActivitiesMappingJsonServer } from './impl/activities-mapping-json-server.service';
import { ActivitiesMappingStrapi } from './impl/activities-mapping-strapi.service';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { StrapiMediaService } from '../services/impl/strapi-media.service';
import { BaseMediaService } from '../services/impl/base-media.service';
import { BaseRepositoryFirebaseService } from './impl/base-repository-firebase.service';
import { AdvenMappingFirebaseService } from './impl/adven-mapping-firebase.service';
import { ActivitiesMappingFirebaseService } from './impl/activities-mapping-firebase.service';
import { FirebaseAuthMappingService } from '../services/impl/firebase-auth-mapping.service';
import { FirebaseAuthenticationService } from '../services/impl/firebase-authentication.service';
import { IAuthentication } from '../services/interfaces/authentication.interface';
import { ICollectionSubscription } from '../services/interfaces/collection-subcription.interface';
import { FirebaseCollectionSubscriptionService } from '../services/impl/firebase-collection-subcription.service';

export function createBaseRepositoryFactory<T extends Model>(
  token: InjectionToken<IBaseRepository<T>>,
  dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, http: HttpClient, auth:IStrapiAuthentication, apiURL: string, resource: string, mapping: IBaseMapping<T>, firebaseConfig?: any) => {
      switch (backend) {
        case 'http':
          return new BaseRepositoryHttpService<T>(http, auth, apiURL, resource, mapping);
        case 'local-storage':
          return new BaseRespositoryLocalStorageService<T>(resource, mapping);
        case 'json-server':
          return new JsonServerRepositoryService<T>(http, auth,apiURL, resource, mapping);
        case 'firebase':
          return new BaseRepositoryFirebaseService<T>(firebaseConfig, resource, mapping);
        case 'strapi':
          return new StrapiRepositoryService<T>(http, auth, apiURL, resource, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseMappingFactory<T extends Model>(
  token: InjectionToken<IBaseMapping<T>>,
  dependencies: any[],
  modelType: 'adven' | 'activity'
): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string, firebaseConfig?: any) => {
      switch (backend) {
        case 'local-storage':
          return modelType === 'adven' 
            ? new AdvenLocalStorageMapping()
            : null;
        case 'json-server':
          return modelType === 'adven'
            ? new AdvenMappingJsonServer()
            : new ActivitiesMappingJsonServer();
        case 'firebase':
          return modelType === 'adven'
            ? new AdvenMappingFirebaseService(firebaseConfig)
            : new ActivitiesMappingFirebaseService(firebaseConfig);
        case 'strapi':
          return modelType === 'adven'
            ? new AdvenMappingStrapi()
            : new ActivitiesMappingStrapi();
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};

export function createBaseAuthMappingFactory(token: InjectionToken<IAuthMapping>, dependencies:any[]): FactoryProvider {
  return {
    provide: token,
    useFactory: (backend: string) => {
      switch (backend) {
        case 'http':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'local-storage':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'json-server':
          throw new Error("BACKEND NOT IMPLEMENTED");
        case 'strapi':
          return new StrapiAuthMappingService();
        case 'firebase':
          return new FirebaseAuthMappingService();
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: dependencies
  };
};


export const AdvenMappingFactory = createBaseMappingFactory<Adven>(
  ADVEN_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
  'adven'
);

export const ActivitiesMappingFactory = createBaseMappingFactory<Activity>(
  ACTIVITIES_REPOSITORY_MAPPING_TOKEN, 
  [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN],
  'activity'
);

export const AuthMappingFactory: FactoryProvider = createBaseAuthMappingFactory(AUTH_MAPPING_TOKEN, [BACKEND_TOKEN]);

export const AuthenticationServiceFactory:FactoryProvider = {
  provide: BaseAuthenticationService,
  useFactory: (backend:string,firebaseConfig:any, signIn:string, signUp:string, meUrl:string, mapping:IAuthMapping, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        return new StrapiAuthenticationService(signIn, signUp, meUrl, mapping, http);
      case 'firebase':
        return new FirebaseAuthenticationService(firebaseConfig, mapping);
        default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN,FIREBASE_CONFIG_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_MAPPING_TOKEN, HttpClient]
};

export const MediaServiceFactory:FactoryProvider = {
  provide: BaseMediaService,
  useFactory: (backend:string,firebaseConfig:any, upload:string, auth:IAuthentication, http:HttpClient) => {
    switch(backend){
      case 'http':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'local-storage':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'json-server':
        throw new Error("BACKEND NOT IMPLEMENTED");
      case 'strapi':
        return new StrapiMediaService(upload, auth as IStrapiAuthentication, http);
      case 'firebase':
        return new FirebaseMediaService(firebaseConfig, auth);
      default:
        throw new Error("BACKEND NOT IMPLEMENTED");
    }
    
  },
  deps: [BACKEND_TOKEN,FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN, BaseAuthenticationService, HttpClient]
};

export const AdvenRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Adven>(ADVEN_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, ADVEN_API_URL_TOKEN, ADVEN_RESOURCE_NAME_TOKEN, ADVEN_REPOSITORY_MAPPING_TOKEN, FIREBASE_CONFIG_TOKEN ]
);
export const ActivitiesRepositoryFactory: FactoryProvider = createBaseRepositoryFactory<Activity>(ACTIVITIES_REPOSITORY_TOKEN,
  [BACKEND_TOKEN, HttpClient, BaseAuthenticationService, ACTIVITIES_API_URL_TOKEN, ACTIVITIES_RESOURCE_NAME_TOKEN, ACTIVITIES_REPOSITORY_MAPPING_TOKEN,FIREBASE_CONFIG_TOKEN]
);

export function createCollectionSubscriptionFactory<T extends Model>(
  collectionName: string,
  mappingToken: InjectionToken<IBaseMapping<T>>,
  collectionSubscriptionToken: InjectionToken<ICollectionSubscription<T>>
): FactoryProvider {
  return {
    provide: collectionSubscriptionToken,
    useFactory: (backend: string, firebaseConfig: any, mapping: IBaseMapping<T>) => {
      switch (backend) {
        case 'firebase':
          return new FirebaseCollectionSubscriptionService<T>(firebaseConfig, mapping);
        default:
          throw new Error("BACKEND NOT IMPLEMENTED");
      }
    },
    deps: [BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, mappingToken]
  };
}
// Factorías específicas para cada tipo
export const AdvensCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Adven>(
  'advens',
  ADVEN_REPOSITORY_MAPPING_TOKEN,
  ADVEN_COLLECTION_SUBSCRIPTION_TOKEN
);
export const ActivitiesCollectionSubscriptionFactory = createCollectionSubscriptionFactory<Activity>(
  'activities',
  ACTIVITIES_REPOSITORY_MAPPING_TOKEN,
  ACTIVITIES_COLLECTION_SUBSCRIPTION_TOKEN
);
