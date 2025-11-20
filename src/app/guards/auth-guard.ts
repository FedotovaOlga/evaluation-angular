import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if (Boolean(localStorage.getItem('isConnected')) == true) {
    return true;
  } else {
    return router.createUrlTree(['/auth'])
  }
};
