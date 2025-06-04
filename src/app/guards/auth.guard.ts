import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);

  const token = localStorage.getItem('jwt_token');

  if (token) {
    console.log('Token encontrado:', token); 
    return true;
  } else {
    console.log('Token não encontrado'); 
    router.navigate(['/login']);
    return false;
  }
};
