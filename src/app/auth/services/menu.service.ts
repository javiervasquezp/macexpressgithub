import { inject, Injectable } from '@angular/core';
import { ClaveVirtualApiHostConstants } from '@core/constants/seguridad-api.constant';
import { environment } from '@envs/environment.development';
import { ApiService } from '@services/api.service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  env = environment;
  seguridadApiConstants = ClaveVirtualApiHostConstants;
  private readonly endPoint = this.env.seguridadtUrl;
  private readonly apiService = inject(ApiService);

  constructor() { }

  ListaMenu() {
    //debugger;
    const url = this.endPoint;
    const path = `${this.seguridadApiConstants.AccessUri.Permission}?codigoAplicacion=${this.env.codigoAplicacion}`;
    const request: any = null;
    return this.apiService.post(url, path, request).pipe(
      map((res: any) => {
        // if(!this.env.production){
        //   console.log("LISTAR MENU");
        //   console.log(res);
        // }
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }
}
