import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      
      if (user.role !== 'collecteur') {
        return true;
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  router.navigate(['/dashboard']);
  return false;
};
