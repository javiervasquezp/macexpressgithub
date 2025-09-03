export interface BoletasPagoModel {
	UltimosPagos: UltimosPagosModel;
	BoletasPagos: BoletasPagosModel[];  
}
export interface UltimosPagosModel {
	DatosCabecera: DatosCabeceraModel;
	DetalleRegimenes: DetalleRegimenesModel[];  
}
export interface DetalleRegimenesModel {
	Regimen: string; 
    DetalleRegimenCuentas: DetalleRegimenCuentasModel[];
}
export interface DetalleRegimenCuentasModel {
	Cuenta: string;  
    Prestacion: string;  
    DetalleCuentaPagos: DetalleCuentaPagosModel[];  
}
export interface DetalleCuentaPagosModel {
    Regimen: string;
    Cuenta: string;
    NumeroEmision: string;
    CodigoProceso: string;
    IndSubProceso: string;
    IndConstanciaPago: string;
    Periodo:string;
    MontoBruto: string;
    MontoNeto: string;
    EstadoPago: string;
    SimboloMoneda:string;
    FechaReintegro: string;
    VisualizaConstanciaPago: boolean;
}
export interface DatosCabeceraModel {
	ApellidoPaterno: string; 
    ApellidoMaterno:string; 
    Nombres:string; 
    SiglaTipoDocumentoIdentidad: string; 
    NumeroDocumentoIdentidad: string; 
    AbreviacionTipoDocumentoIdentidad: string; 
    DescripcionTipoDocumentoIdentidad: string; 
}
export interface BoletasPagosModel {
    descripcionCuenta: string; 
    numRegLey: string; 
    desEntRepago: string; 
    fechaReintegro: string; 
    numEmision: string; 
    codProc: string; 
    inSubProceso:string; 
    desEmision: string; 
    simbMoneda: string; 
    montoPagoBruto: string; 
    montoPagoNeto: string; 
    estPago: string; 
    inConsPago: string; 
	DetalleRegimenes: string;  
}
export interface Resolucion{
    IdPersona: number;
    TipoDocumento: string;
    TipoDocumentoAbrev: string;
    CoDocuIden: string;
    ApellidoPaterno: string;
    ApellidoMaterno: string;
    Nombres: string;
    NombresCompleto: string;
    IdDocu: number;
    CodFilnDocu: string;
    CoDocu: string;
    CoTipoDocu: string;
    DeTipoDocu: string;
    CoSubtDocu: string;
    DeSubtDocu: string;
    FeEmi: string;
    CoSoli: string;
}

export interface ImprimirResolucion
{
    TipoDocumentoId : number;
    NumeroDocumento : string;
    Appcode : string;
    ResolucionResp : Resolucion;
    NombreEntidad : string;
    Correo : string;
    Nombres : string;
    NombreArchivo : string;
}

export interface SendConstanciaPagoRequest
{
    TipoDocumentoId : string;
    NumeroDocumento : string;
    NumReg : string;
    Cuenta : string;
    Emision : string;
    CodProceso : string;
    ISubProc : string;
    Nombres : string;
    NombreEntidad : string;
    NombreArchivo : string;
    Correo : string;
    Periodo : string;
}