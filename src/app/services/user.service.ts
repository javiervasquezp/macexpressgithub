import { Injectable } from '@angular/core';
import { Usuario } from '@core/models/usuario.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CoreConstants } from '@core/constants/core.constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  getLoggedUsers(localStorageKey: string): Usuario {
    let user: Usuario;
    var token = this.getToken(localStorageKey);
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    user = decodedToken as Usuario;
    return user;
  }

  getToken(key :string): string {
    let authAppToken: { value: '' };
    authAppToken = JSON.parse(localStorage.getItem(key) || '{}');
    if (authAppToken.value == undefined) {
      return '';
    } else {
      if (authAppToken.value.length == 0) {
        return '';
      } else {
        return authAppToken.value;
      }
    }
  }

  isAuthenticate(): boolean {
    let authAppToken: { value: '' };
    authAppToken = JSON.parse(localStorage.getItem(CoreConstants.LocalStorage.Token) || '{}');
    if (authAppToken.value == undefined) {
      return false;
    } else {
      if (authAppToken.value.length == 0) {
        return false;
      } else {
        return true;
      }
    }
  }

  setLogOut() {
    localStorage.removeItem(CoreConstants.LocalStorage.Token);
    localStorage.removeItem(CoreConstants.LocalStorage.NavegationId);
    localStorage.removeItem(CoreConstants.LocalStorage.Usuario);
  }

  authlogon() {
    //window.location.href=`${environment.authlogon}`;
  }

  setToken(token: string) {
    //debugger;
    let authAppToken: {};
    authAppToken = {
      createdAt: Date.now(),
      name: "nb:auth:jwt:token",
      ownerStrategyName: "email",
      value: token
    }
    localStorage.setItem(CoreConstants.LocalStorage.Token, JSON.stringify(authAppToken));
  }
}
