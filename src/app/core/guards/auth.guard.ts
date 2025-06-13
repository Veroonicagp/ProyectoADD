import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { filter, map, switchMap, take } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(BaseAuthenticationService);
    const router = inject(Router);
  
    return authService.ready$.pipe(
        filter(isReady => isReady), 
        take(1), 
        switchMap(() => authService.authenticated$), 
        map(isLoggedIn => {
          if (isLoggedIn) {
            return true;
          } else {
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
          }
        })
    );
  };