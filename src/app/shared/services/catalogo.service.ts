import { Injectable, inject, runInInjectionContext, signal } from '@angular/core';
import { ClaveVirtualApiHpstConstants } from '@core/constants/seguridad-api.constant';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TiposDocumentoIdentidad } from '@core/models/tipos.model';
import { ApiService } from '@services/api.service';
import { environment } from '@envs/environment.development';
import { CoreConstants } from '@core/constants/core.constant';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private readonly apiService = inject(ApiService);
  tiposDocumentosIdentidad : TiposDocumentoIdentidad[] | undefined;
  private readonly endPoint = environment.seguridadtUrl;

  constructor() {
  }
  public getTiposDocumentosIdentidad(): any {
    //debugger;
    const url = ClaveVirtualApiHpstConstants.AuthUri.GetDocumentType;
    return this.apiService.get(this.endPoint, url,).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((err) => {
        return throwError('Error inesperado en el servidor');
      })
    );
  }

  public setStorageTiposDocumentos(tiposDocumentosIdent : TiposDocumentoIdentidad[] ){
    localStorage.setItem(CoreConstants.LocalStorage.TiposDocumento, JSON.stringify(tiposDocumentosIdent));  
  }

  public getTiposDocumentosidentidadFromStorage() : TiposDocumentoIdentidad[]{
    this.tiposDocumentosIdentidad = JSON.parse(localStorage.getItem(CoreConstants.LocalStorage.TiposDocumento) || '{}') as TiposDocumentoIdentidad[] ; 
    return this.tiposDocumentosIdentidad;
  }

  public removeTiposDocumentosidentidadFromStorage() {
    localStorage.removeItem(CoreConstants.LocalStorage.TiposDocumento);
  }
}
