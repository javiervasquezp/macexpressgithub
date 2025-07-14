import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { AuthService } from 'app/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if(!authService.isAuthenticate()){
    //debugger;
    localStorage.removeItem(CoreConstants.LocalStorage.Usuario);
    localStorage.removeItem(CoreConstants.LocalStorage.Token);
    router.navigateByUrl(CoreConstants.Rutas.login);
    return false;
  }
  
  return true;
};
