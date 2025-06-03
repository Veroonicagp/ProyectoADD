import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService } from './core/services/language.service';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { AdvenService } from './core/services/impl/adven.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';
import { Observable, combineLatest, of, Subject } from 'rxjs';
import { map, switchMap, takeUntil, startWith } from 'rxjs/operators';
import { User } from './core/models/auth.model';
import { Adven } from './core/models/adven.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentLang: string;
  user$: Observable<User | undefined>;
  userProfile$: Observable<{user: User, adven: Adven | null} | null>;
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    public authSvc: BaseAuthenticationService,
    private advenSvc: AdvenService,
    private translate: TranslateService,
    private menuCtrl: MenuController,
    private router: Router
  ) {
    this.currentLang = this.languageService.getStoredLanguage();
    this.user$ = this.authSvc.user$;
    
    this.userProfile$ = this.user$.pipe(
      switchMap(user => {
        if (user) {
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
          return of(null);
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit() {
    // Lógica adicional si la necesitas
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeLanguage() {
    const currentLang = this.translate.currentLang;
    const newLang = currentLang === 'en' ? 'es' : 'en';
    this.translate.use(newLang);
  }

  logout() {
    this.menuCtrl.close();
    this.authSvc.signOut().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}