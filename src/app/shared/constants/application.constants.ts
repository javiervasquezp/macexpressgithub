export module ApplicationConstants{
    export const Titulos = {
        VerAportes: "Ver aportes"
    }
    export const TipoDocumento = {
        DNI: "01"
    }

    export const tipoDocumentoId = {
        DNI: 23,
        Pasaporte: 4,
        CarneExtranjeria: 5,
        PTP: 51
    }
    
    export const TipoDocumentoLenght = {
        DNI: 8,
        Otro: 15
    }

    export const Rutas = {
        verAportes: "aportante/ver-aportes",        
        login: "login"
    }

    export const General = {
        TamanioMaximoAdjuntarMB: 2,
    }
    
    export const ContentTypeFiles = {
        contentTypeExcel: "application/vnd.ms-excel",
        contentTypePDF: "application/pdf" 
    }

    export const StorageNames = {
        tiposdocumentosidentidad: "tiposdocumentosidentidad",
    }

    export const TitulosToastr = {
        Warning: 'Advertencia',
        Error: 'Error',
        Info: 'Atención',
        Success: 'Éxito'
      };
}