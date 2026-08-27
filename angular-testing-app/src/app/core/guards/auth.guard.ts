import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logger = inject(LoggerService);

  if (authService.isAuthenticated()) {
    return true;
  }

  logger.warn('Unauthorized access attempt intercepted', state.url);
  // In a real app we might redirect to /login
  // Since we don't have a login route as per requirements, we'll just return false.
  // We can redirect to root.
  return router.parseUrl('/');
};
