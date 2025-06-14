import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { BaseAuthenticationService } from '../services/impl/base-authentication.service';
import { filter, map, switchMap, take } from 'rxjs';

export const authRedirectGuard: CanActivateFn = (route, state) => {
    const authService = inject(BaseAuthenticationService);
    const router = inject(Router);
  
    return authService.ready$.pipe(
      filter((isReady) => isReady),
      take(1),
      switchMap(() => authService.authenticated$),
      map((isLoggedIn) => {
        if (isLoggedIn) {
          console.log('Usuario ya autenticado, redirigiendo a /activities');
          router.navigate(['/activities']); 
          return false;
        } else {
          console.log('Usuario no autenticado, permitiendo acceso a login/register');
          return true;
        }
      })
    );
};