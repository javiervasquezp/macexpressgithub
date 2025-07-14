import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CoreConstants } from '@core/constants/core.constant';
import { environment } from '@envs/environment.development';
import { UserService } from '@services/user.service';
import { from, switchMap } from 'rxjs';

declare const AwsWafIntegration: any; // Asegúrate de declarar AwsWafIntegration

export const AuthJwtInterceptor: HttpInterceptorFn = (req, next) => {

  //debugger;
  const authService = inject(UserService);
  const esProd = environment.production;
  
  if (authService.isAuthenticate()) {

    let authAppToken: { value: '' };
    authAppToken = JSON.parse(localStorage.getItem(CoreConstants.LocalStorage.Token) || '{}');

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authAppToken.value}`
      }  
    });
  } else {
    localStorage.removeItem(CoreConstants.LocalStorage.Usuario);
    localStorage.removeItem(CoreConstants.LocalStorage.Token);
  }

  // Pass the modified request to the next handler
  return next(req);
};