import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/impl/user.service';
import { map, take } from 'rxjs';

export const ManagerGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.isManager().pipe(
    take(1),
    map(isManager => {
      if (isManager) {
        return true;
      } else {
        router.navigate(['/activities']);
        return false;
      }
    })
  );
};