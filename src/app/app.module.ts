import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { ACTIVITIES_API_URL_TOKEN, ACTIVITIES_RESOURCE_NAME_TOKEN, ADVEN_API_URL_TOKEN, ADVEN_RESOURCE_NAME_TOKEN, AUTH_ME_API_URL_TOKEN, AUTH_SIGN_IN_API_URL_TOKEN, AUTH_SIGN_UP_API_URL_TOKEN, BACKEND_TOKEN, FIREBASE_CONFIG_TOKEN, UPLOAD_API_URL_TOKEN } from './core/repositories/repository.tokens';
import { ActivitiesMappingFactory, AdvenMappingFactory, AuthMappingFactory, AdvenRepositoryFactory, AuthenticationServiceFactory, MediaServiceFactory, ActivitiesRepositoryFactory, AdvensCollectionSubscriptionFactory, ActivitiesCollectionSubscriptionFactory } from './core/repositories/repository.factory';
import { AdvenService } from './core/services/impl/adven.service';
import { ActivitiesService } from './core/services/impl/activities.service';
import { UserService } from './core/services/impl/user.service'; // NUEVO IMPORT
import { environment } from 'src/environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
    }),
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    { provide: BACKEND_TOKEN, useValue: 'firebase' },
    {provide: ADVEN_RESOURCE_NAME_TOKEN,useValue: 'adventurers'},
    {provide: ACTIVITIES_RESOURCE_NAME_TOKEN,useValue: 'activities'},
    {provide: ADVEN_API_URL_TOKEN,useValue: environment.apiUrl+'/api'},
    { provide: ACTIVITIES_API_URL_TOKEN, useValue: environment.apiUrl+'/api' },
    { provide: AUTH_SIGN_IN_API_URL_TOKEN, useValue: environment.apiUrl+'/api/auth/local' },
    { provide: AUTH_SIGN_UP_API_URL_TOKEN, useValue: environment.apiUrl+'/api/auth/local/register' },
    { provide: AUTH_ME_API_URL_TOKEN, useValue: environment.apiUrl+'/api/users/me' },
    { provide: UPLOAD_API_URL_TOKEN, useValue: environment.apiUrl+'/api/upload' },
    { provide: FIREBASE_CONFIG_TOKEN, useValue: 
      {
        apiKey: "AIzaSyBbtUPNed22rwit8mAu9ByodZ5fLIcmS_k",
        authDomain: "readytooenjoy.firebaseapp.com",
        projectId: "readytooenjoy",
        storageBucket: "readytooenjoy.firebasestorage.app",
        messagingSenderId: "377843416377",
        appId: "1:377843416377:web:1bffc7a00cfab1e5523ce8"
      } 
    },
    AdvenMappingFactory,
    ActivitiesMappingFactory,
    AuthMappingFactory,
    AdvenRepositoryFactory,
    ActivitiesRepositoryFactory,
    {
      provide: 'AdvenService',
      useClass: AdvenService
    },
    {
      provide: 'ActivitiesService',
      useClass: ActivitiesService
    },
    
    UserService,
    AuthenticationServiceFactory,
    MediaServiceFactory,
    AdvensCollectionSubscriptionFactory,
    ActivitiesCollectionSubscriptionFactory
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}