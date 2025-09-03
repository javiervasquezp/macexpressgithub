import { Injectable } from '@angular/core';
import { CoreConstants } from '@core/constants/core.constant';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  convertBase64ToBlobData(base64Data: string, contentType: string='image/png', 
                            sliceSize=512) : Blob {
    const byteCharacters = atob(base64Data); 
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  getNombreTipoDocumentoFromNspIdTipoDocumento(idTipoDocNsp: string) : string {
    var nombreTipoDoc = "";

    switch(idTipoDocNsp){
      case CoreConstants.IdTipoDocumentoNsp.DNI:
        nombreTipoDoc = CoreConstants.DescripcionTipoDocumentoIdentidad.DNI;
        break;
      case CoreConstants.IdTipoDocumentoNsp.CarneExtrajeria:
        nombreTipoDoc = CoreConstants.DescripcionTipoDocumentoIdentidad.CarneExtrajeria;
        break;
      case CoreConstants.IdTipoDocumentoNsp.Pasaporte:
        nombreTipoDoc = CoreConstants.DescripcionTipoDocumentoIdentidad.Pasaporte;
        break;
      default:
        nombreTipoDoc = "OTROS";
        break;
    }
    
    return nombreTipoDoc;
  }
  
  stringIsvalid(value: string) : boolean {
    var esValido = false;

    if(value != null && value != undefined && value.length > 0)
      esValido= true;
    
    return esValido;
  }

  getUtcDate(localDate : Date) : Date{
    //debugger;
    var year = localDate.getUTCFullYear();
    var month = localDate.getUTCMonth();
    var day = localDate.getUTCDate();
    var hour = localDate.getUTCHours();
    var minuntes = localDate.getUTCMinutes();
    var seconds = localDate.getUTCSeconds();

    return new Date(year, month, day, hour, minuntes, seconds);
  }

  getDateFromStringDDHMMYYYYSpaceddmmss(strDate : string) : Date{
    //debugger;
    //17/05/2024 05:00:00
    const [fecha, hora] = strDate.split(" ");
    const [hh, mm, ss] = hora.split(":");
    const [dd, MM, yyyy] = fecha.split("/");

    var year = Number.parseInt(yyyy);
    var month = Number.parseInt(MM) - 1;
    var day = Number.parseInt(dd);
    var hour = Number.parseInt(hh);
    var minuntes = Number.parseInt(mm);
    var seconds = Number.parseInt(ss);

    return new Date(year, month, day, hour, minuntes, seconds);
  }

  esCorreoValido(email: string): boolean {
    // Expresión regular para validación básica de email
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
}
