// src/app/repositories/repository.tokens.ts
import { InjectionToken } from '@angular/core';
import { IBaseRepository } from './intefaces/base-repository.interface';
import { IAdvenRepository } from './intefaces/adven-repository.interface';
import { IBaseMapping } from './intefaces/base-mapping.interface';
import { Adven } from '../models/adven.model';
import { IStrapiAuthentication } from '../services/interfaces/strapi-authentication.interface';
import { IAuthentication } from '../services/interfaces/authentication.interface';
import { ICollectionSubscription } from '../services/interfaces/collection-subcription.interface';
import { Model } from '../models/base.model';
import { Activity } from '../models/activity.model';

export const RESOURCE_NAME_TOKEN = new InjectionToken<string>('ResourceName');
export const ADVEN_RESOURCE_NAME_TOKEN = new InjectionToken<string>('AdvenResourceName');
export const ACTIVITIES_RESOURCE_NAME_TOKEN = new InjectionToken<string>('ActivitiesResourceName');
export const REPOSITORY_TOKEN = new InjectionToken<IBaseRepository<any>>('REPOSITORY_TOKEN');
export const ADVEN_REPOSITORY_TOKEN = new InjectionToken<IAdvenRepository>('IAdvenRepository');
export const ACTIVITIES_REPOSITORY_TOKEN = new InjectionToken<IAdvenRepository>('IActivitiesRepository');

export const API_URL_TOKEN = new InjectionToken<string>('ApiUrl');
export const ADVEN_API_URL_TOKEN = new InjectionToken<string>('AdvenApiUrl');
export const ACTIVITIES_API_URL_TOKEN = new InjectionToken<string>('ActivitiesApiUrl');
export const TASKS_API_URL_TOKEN = new InjectionToken<string>('TasksApiUrl');
export const AUTH_SIGN_IN_API_URL_TOKEN = new InjectionToken<string>('AuthSignInApiUrl');
export const AUTH_SIGN_UP_API_URL_TOKEN = new InjectionToken<string>('AuthSignUpApiUrl');
export const AUTH_ME_API_URL_TOKEN = new InjectionToken<string>('AuthMeApiUrl');
export const UPLOAD_API_URL_TOKEN = new InjectionToken<string>('UploadApiUrl');

export const REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<any>>('IBaseRepositoryMapping');
export const ADVEN_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Adven>>('IAdvenRepositoryMapping');
export const ACTIVITIES_REPOSITORY_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Activity>>('IActivitiesRepositoryMapping');
export const AUTH_TOKEN = new InjectionToken<IAuthentication>('IAuthentication');
export const STRAPI_AUTH_TOKEN = new InjectionToken<IStrapiAuthentication>('IStrapiAuthentication');
export const AUTH_MAPPING_TOKEN = new InjectionToken<IBaseMapping<Adven>>('IAuthMapping');
export const BACKEND_TOKEN = new InjectionToken<string>('Backend');
export const FIREBASE_CONFIG_TOKEN = new InjectionToken<any>('FIREBASE_CONFIG_TOKEN');
export const FIREBASE_COLLECTION_TOKEN = new InjectionToken<string>('FIREBASE_COLLECTION_TOKEN');
export const COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Model>>('CollectionSubscriptionToken');
export const ADVEN_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Adven>>('AdvenCollectionSubscriptionToken');
export const ACTIVITIES_COLLECTION_SUBSCRIPTION_TOKEN = new InjectionToken<ICollectionSubscription<Activity>>('ActivitiesCollectionSubscriptionToken');