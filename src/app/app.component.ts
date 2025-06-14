import { Component, OnInit, OnDestroy, Inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { LanguageService } from './core/services/language.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { AdvenService } from './core/services/impl/adven.service';
import { UserService } from './core/services/impl/user.service';
import { CsvExportService } from './core/services/impl/csv-export.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuController, ActionSheetController, AlertController } from '@ionic/angular';
import { Observable, combineLatest, of, Subject, merge, Subscription, BehaviorSubject } from 'rxjs';
import { map, switchMap, takeUntil, startWith, distinctUntilChanged } from 'rxjs/operators';
import { User } from './core/models/auth.model';
import { Adven } from './core/models/adven.model';
import { RoleType } from './core/models/user-role.model';
import { ADVEN_COLLECTION_SUBSCRIPTION_TOKEN } from './core/repositories/repository.tokens';
import { CollectionChange, ICollectionSubscription } from './core/services/interfaces/collection-subcription.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentLang: string;
  user$: Observable<User | undefined>;
  userProfile$: Observable<{user: User, adven: Adven | null} | null>;
  userRole$: Observable<RoleType>;
  
  private destroy$ = new Subject<void>();
  private subscription?: Subscription;
  private currentUserId: string = '';
  private _forceUpdate = new BehaviorSubject<number>(0);

  constructor(
    private languageService: LanguageService,
    public authSvc: BaseAuthenticationService,
    private advenSvc: AdvenService,
    private userService: UserService,
    private csvExportService: CsvExportService,
    public translate: TranslateService, 
    private menuCtrl: MenuController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    @Inject(ADVEN_COLLECTION_SUBSCRIPTION_TOKEN)
    private userSubscription: ICollectionSubscription<Adven>
  ) {
    this.currentLang = this.languageService.getStoredLanguage();
    this.user$ = this.authSvc.user$;
    
    this.userRole$ = this.userService.getCurrentUserRole().pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    );
    
    this.userProfile$ = combineLatest([
      this.user$,
      merge(
        of(true),
        this.advenSvc.advenUpdated$,
        this._forceUpdate.asObservable()
      )
    ]).pipe(
      switchMap(([user, _]) => {
        if (user) {
          this.currentUserId = user.id;
          
          return combineLatest([
            of(user),
            this.advenSvc.getByUserId(user.id).pipe(
              startWith(null)
            )
          ]).pipe(
            map(([userData, advenData]) => ({
              user: userData,
              adven: advenData
            }))
          );
        } else {
          this.currentUserId = '';
          return of(null);
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit() {
    this.userProfile$.subscribe(profile => {
      if (profile) {
        console.log('Usuario logueado:', profile.user);
        console.log('Perfil aventurero actualizado:', profile.adven);
      }
    });

    this.userRole$.subscribe(role => {
      console.log('Rol del usuario en menú:', role);
    });

    this.authSvc.authenticated$.pipe(
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(isAuth => {
      console.log('Estado de autenticación en app:', isAuth);
      
      if (isAuth) {
        this.setupGlobalSubscription();
      } else {
        this.cleanupSubscription();
      }
    });
  }

  private setupGlobalSubscription() {
    if (!this.userSubscription) {
      console.error('userSubscription no disponible');
      return;
    }

    this.cleanupSubscription();

    try {
      this.subscription = this.userSubscription.subscribe('adventurers').subscribe({
        next: (change: CollectionChange<Adven>) => {
          this.handleGlobalSubscriptionChange(change);
        },
        error: (error) => {
          console.error('Error en suscripción global del menú:', error);
        }
      });
    } catch (error) {
      console.error('Error configurando suscripción global del menú:', error);
    }
  }

  private handleGlobalSubscriptionChange(change: CollectionChange<Adven>) {
    if (!change.data || change.data.userId !== this.currentUserId) {
      return;
    }

    switch(change.type) {
      case 'added':
      case 'modified':
        this.ngZone.run(() => {
          this.advenSvc.triggerUpdate();
          this._forceUpdate.next(Date.now());
          this.cdr.detectChanges();
        });
        break;
        
      case 'removed':
        this.ngZone.run(() => {
          this.logout();
        });
        break;
    }
  }

  private cleanupSubscription() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanupSubscription();
    
    if (this.userSubscription) {
      this.userSubscription.unsubscribe('adventurers');
    }

    this._forceUpdate.complete();
  }

  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    
    const languageBtn = document.querySelector('.menu-language-btn');
    if (languageBtn) {
      languageBtn.classList.add('changing');
      setTimeout(() => {
        languageBtn.classList.remove('changing');
      }, 600);
    }
    
    this.translate.use(newLang);
    this.languageService.storeLanguage(newLang);
    this.currentLang = newLang;
  }

  logout() {
    this.menuCtrl.close();
    this.cleanupSubscription();
    
    this.authSvc.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  async openExportMenu() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Exportar Datos ReadyToEnjoy',
      cssClass: 'export-action-sheet',
      buttons: [
        {
          text: 'Exportar Aventureros',
          icon: 'people-outline',
          handler: () => {
            this.csvExportService.exportUsers();
          }
        },
        {
          text: 'Exportar Actividades',
          icon: 'map-outline', 
          handler: () => {
            this.csvExportService.exportActivities();
          }
        },
        {
          text: 'Exportar Todo (CSV)',
          icon: 'download-outline',
          handler: () => {
            this.csvExportService.exportAllData({
              includeUsers: true,
              includeActivities: true,
              format: 'csv'
            });
          }
        },
        {
          text: 'Exportar como JSON',
          icon: 'document-outline',
          handler: () => {
            this.csvExportService.exportAsJSON();
          }
        },
        {
          text: 'Exportación Avanzada',
          icon: 'settings-outline',
          handler: () => {
            this.openAdvancedExportOptions();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async openAdvancedExportOptions() {
    const alert = await this.alertController.create({
      header: 'Exportación Avanzada',
      message: 'Personaliza tu exportación:',
      cssClass: 'advanced-export-alert',
      inputs: [
        {
          name: 'includeUsers',
          type: 'checkbox',
          label: 'Incluir Aventureros',
          value: 'users',
          checked: true
        },
        {
          name: 'includeActivities',
          type: 'checkbox',
          label: 'Incluir Actividades',
          value: 'activities',
          checked: true
        },
        {
          name: 'format',
          type: 'radio',
          label: 'Formato CSV',
          value: 'csv',
          checked: true
        },
        {
          name: 'format',
          type: 'radio',
          label: 'Formato JSON',
          value: 'json'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Exportar',
          handler: (data) => {
            const options = {
              includeUsers: data.includes('users'),
              includeActivities: data.includes('activities'),
              format: data.includes('json') ? 'json' as const : 'csv' as const
            };

            if (options.format === 'json') {
              this.csvExportService.exportAsJSON();
            } else {
              this.csvExportService.exportAllData(options);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  
  async showExportPreview() {
    const alert = await this.alertController.create({
      header: 'Vista Previa de Exportación',
      message: `
        <div style="text-align: left;">
          <p><strong>📊 Resumen de datos disponibles:</strong></p>
          <p>👥 Aventureros registrados</p>
          <p>🎯 Actividades publicadas</p>
          <p>📅 Datos actualizados al: ${new Date().toLocaleDateString('es-ES')}</p>
        </div>
      `,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        },
        {
          text: 'Continuar con Exportación',
          handler: () => {
            this.openExportMenu();
          }
        }
      ]
    });

    await alert.present();
  }
}