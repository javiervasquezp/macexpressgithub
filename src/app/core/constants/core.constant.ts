export module CoreConstants {
    export const LocalStorage = {
        Usuario: 'usuario',
        Token: 'app_token',
        NavegationId:'navegationId',
        TiposDocumento : "tiposDocumento"
    };
    export const CodigoRespuesta = {
        OperacionExitosa: "0000",
        OperacionNoEjecutada: "0001",
        ErrorNoControlado: "0002",
        OperacionIncorrectaDatos: "0003",
        NoAutorizado: "0004",
        CambioClave: "0005"
    };

    export const Mensajes = {
        SesionExpirada: 'Su sesión ha expirado/no tiene permiso.',
        NoHayConexion: 'Error de conexión, intenta nuevamente',
        NoAutorizado: 'Usuario y/o clave no válido.',
        SinDatos: "No se han encontrado datos.",
        DNIInvalido: "Ingresa un DNI de 8 dígitos valido.",
        OtroTipoDocumentoInvalido: "Ingresa un número de documento valido.",
        SeleccionarDatosIdentidad: "Seleccionar el tipo y número de documento."
    };

    export const Titulos = {
        VerAportes: "Ver Reporte de aportes",
        VerBoletasPago: "Ver Boletas de Pago",
        VerResoluciones: "Ver resoluciones"
    };

    export const TipoDocumento = {
        DNI: "01"
    };

    export const TipoDocumentoClaveVirtual = {
        DNI: 23,
        CE: 5,
        PASAPORTE: 4,
        PTP: 51
    };

    export const TipoDocumentoLenght = {
        DNI: 8,
        Otro: 20
    };

    export const Rutas = {
        login: "login",
        resoluciones: "features/pensionista/resoluciones",        
        boletasDePago: "features/pensionista/boletas-pago",   
        reporteAportes: "features/aportante/reporte-aportes-acreditados",  
        pagoFacil: "features/aportante/pago-facil-viewer"
    };

    export const General = {
        TamanioMaximoAdjuntarMB: 2,
        aportesFacultativosObligatorios : '0',
        aportesFacultativosAdicionales : '1',
        itemPorPagina : 20,
        estadoBloqueado : '0',
        estadoPagaDeuda : '1',
        estadoAdiciona : '2',
        estadoPrePago : '3',
        estadoHabilitado : '4'
    };
    
    export const ContentTypeFiles = {
        contentTypeExcel: "application/vnd.ms-excel",
        contentTypePDF: "application/pdf" 
    };

    export const StorageNames = {
        tiposdocumentosidentidad: "tiposdocumentosidentidad",
    };

    export const TitulosToastr = {
        Warning: 'Advertencia',
        Error: 'Error',
        Info: 'Atención',
        Success: 'Éxito'
    };

    export const IdTipoDocumentoNsp = {
        DNI: 'DI',
        Pasaporte: 'PS',
        CarneExtrajeria: 'CE'
    };

    export const DescripcionTipoDocumentoIdentidad = {
        DNI: 'DNI',
        Pasaporte: 'PASAPORTE',
        CarneExtrajeria: 'CARNET EXT.'
    };

    export const AplicacionCode = {
        MacExpressCode: 'MacExp'
    };

    export const NombresReportes = {
        aportesAcreditados: 'Reporte_de_Aportes',
        boletasPago: 'Boleta_De_Pago',
        resolucion: "Resolucion"
    };
}