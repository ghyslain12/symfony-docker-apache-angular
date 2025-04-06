import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { concatMap, catchError } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const url = state.url;

  return authService.callConfig().pipe(
    concatMap((response: any) => {
      const jwtEnabled =  (typeof response?.jwt_enabled == "string") ? response?.jwt_enabled === 'true': response?.jwt_enabled;

      if (!jwtEnabled) {
        return of(true);
      }

      if (authService.isAuthenticated() || url === '/user/add') {
        return of(true);
      }

      router.navigate(['/login']);
      return of(false);
    }),
    catchError((err) => {
      if (authService.isAuthenticated() || url === '/user/add') {
        return of(true);
      }
      router.navigate(['/login']);
      return of(false);
    })
  );
};
