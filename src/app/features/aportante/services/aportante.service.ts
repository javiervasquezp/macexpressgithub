import { Injectable, inject } from '@angular/core';
import { AportanteApiConstants } from '@core/constants/aportante-api.constant';
import { environment } from '@envs/environment.development';
import { ApiService } from '@services/api.service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AportanteService {

  
  private readonly endPoint = environment.apiServiceUrlAportante;
  private readonly apiService = inject(ApiService);
  constructor(  ) {
  }

  getEstadoReporteAportesAcreditados(tipodocumento:string, numeroDoc:string) {
    //debugger;
    const url= this.endPoint;
    const path = AportanteApiConstants.EstadoCuentaAportesUri.GetAporteAcreditados + `/${tipodocumento}/${numeroDoc}`; 
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

  getPeriodoPago(typeDoc: string, numDoc: string, tipoAporte: string, numPag: string, tamPag: string) {
    //debugger;
    const url= this.endPoint;
    const path = `${AportanteApiConstants.PagoFacilUri.PagoFacil}/${typeDoc}/${numDoc}/${tipoAporte}/${numPag}/${tamPag}`;
    return this.apiService.get(url,path).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
       // this.toastr.error(CoreConstants.Mensajes.NoHayConexion,CoreConstants.TitulosToastr.Error);
        return throwError('Error inesperado en el servidor');
      })
    );
  }

  verPeriodo(tipodocumento:string, numero:string) {
    const url = this.endPoint;
    const path = `${AportanteApiConstants.EstadoCuentaAportesUri.EstadoCuentaAportes}/${tipodocumento}/${numero}`;
    return this.apiService.get(url,path).pipe(
      map((res:any) => {
        return res;
      }),
      catchError((err) => {
        console.log(err);
        // this.toastr.error(CoreConstants.Mensajes.NoHayConexion,CoreConstants.TitulosToastr.Error);
        return throwError('Error inesperado en el servidor');
      })
    );
  }
}
