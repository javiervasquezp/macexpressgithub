import { Injectable, inject } from '@angular/core';
import { CoreConstants } from '@core/constants/core.constant';
import { PensionistaApiConstants } from '@core/constants/pensionista-api.constant';
import { ImprimirResolucion } from '@core/models/pensionista.models';
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
        return throwError('Error inesperado en el servidor');
      })
    );
  }

  descargarConstancia(numReg:string,   cuenta:string,   emision:string,   codProceso :string,   iSubProc:string) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.ConstanciaPago.GetConstanciaDePago+`/${numReg}/${cuenta}/${emision}/${codProceso}/${iSubProc}`; 
    return this.apiService.get(url, path).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError('Error inesperado en el servidor');
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
        return throwError('Error inesperado en el servidor');
      })
    );
  }

  imprimirResolucion(resolucion: ImprimirResolucion) {
    //debugger;
    const url=`${this.endPoint}`;
    const path = PensionistaApiConstants.Resoluciones.PostImprimirResolucionLikeTotem; 

    return this.apiService.post(url, path, resolucion).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        return throwError('Error inesperado en el servidor');
      })
    );
  }
}
