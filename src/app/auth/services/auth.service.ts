import { Injectable, inject } from '@angular/core';
import { ClaveVirtualApiHostConstants } from '@core/constants/seguridad-api.constant';
import { CoreConstants } from '@core/constants/core.constant';
import { LogIngRequest } from '@core/models/auth.modes';
import { UserService } from '@services/user.service';
import { UtilsService } from '@services/utils.service';
import { catchError, map, throwError } from 'rxjs';
import { ApiService } from '@services/api.service';
import { environment } from '@envs/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiService = inject(ApiService);
  private readonly utilService = inject(UtilsService);
  private readonly userService = inject(UserService);
  private readonly endPoint = environment.seguridadtUrl;
  constructor() {
  }

  public login(body : LogIngRequest): any {
    //debugger;
    const url = ClaveVirtualApiHostConstants.AuthUri.LoginMacExpress;
    return this.apiService.post(this.endPoint, url,body).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }

  
  isAuthenticate(): boolean {
    //debugger;
    let authAppToken: { value: '' };
    authAppToken = JSON.parse(localStorage.getItem(CoreConstants.LocalStorage.Token) || '{}');

    if (!this.utilService.stringIsvalid(authAppToken.value)) {
      return false;
    } 
    
    var usuario = this.userService.getLoggedUsers(CoreConstants.LocalStorage.Token);

    if(usuario == null || usuario == undefined){
      return false;
    }

    var localHoy = new Date();

    var utcHoy = this.utilService.getUtcDate(localHoy);  

    var utcInicio = this.utilService.getDateFromStringDDHMMYYYYSpaceddmmss( usuario.horaInicioUtc);
    var utcFin = this.utilService.getDateFromStringDDHMMYYYYSpaceddmmss( usuario.horaFinUtc);

    if(utcHoy < utcInicio || utcHoy > utcFin){
      return false;
    }

    return true;
    
  }
}
