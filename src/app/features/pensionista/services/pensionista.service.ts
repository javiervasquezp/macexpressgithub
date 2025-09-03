import { Injectable, inject } from '@angular/core';
import { CoreConstants } from '@core/constants/core.constant';
import { PensionistaApiConstants } from '@core/constants/pensionista-api.constant';
import { ImprimirResolucion, SendConstanciaPagoRequest } from '@core/models/pensionista.models';
import { environment } from '@envs/environment.development';
import { ApiService } from '@services/api.service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PensionistaService {

  private readonly endPoint = environment.apiServicePensionistaUrl;
  private readonly apiService = inject(ApiService);
  
  constructor() { }

  getConstanciaPagoByDocumentoIdentidad(tipodocumento:string, numeroDoc:string) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.ConstanciaPago.GetByDocumentoIdentidad+`/${tipodocumento}/${numeroDoc}/${CoreConstants.AplicacionCode.MacExpressCode}`; 
    return this.apiService.get(url, path).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }

  getResoluciones(idTipoDocumento : number,   numeroDocumento:string) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.Resoluciones
                  .GetResolucionesLikeTotem+`/${idTipoDocumento}/${numeroDocumento}/${CoreConstants.AplicacionCode.MacExpressCode}`; 
    return this.apiService.get(url, path).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }

  imprimirResolucion(resolucion: ImprimirResolucion) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.Resoluciones.PostImprimirResolucionNotificacionLikeTotem; 

    return this.apiService.post(url, path, resolucion).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }

  sendMailResolucion(resolucion: ImprimirResolucion) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.Resoluciones.PostSendResolucionLikeTotem; 

    return this.apiService.post(url, path, resolucion).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }

  obtenerBoletaPagoPdf(request: SendConstanciaPagoRequest) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.ConstanciaPago.PostObtenerBoletaPagoPdf;
    return this.apiService.post(url, path, request).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }

  sendMailBoletaPagoPdf(request: SendConstanciaPagoRequest) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.ConstanciaPago.PostSendMailBoletaPagoPdf;
    return this.apiService.post(url, path, request).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new Error('Error inesperado en el servidor'));
      })
    );
  }
}
