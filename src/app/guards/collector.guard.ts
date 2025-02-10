import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const collectorGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      
      if (user.role === 'collecteur') {
        return true;
      }else{
        router.navigate(['/home']);
        return false
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  router.navigate(['/login']);
  return false;
};
