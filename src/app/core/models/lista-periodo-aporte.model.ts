export interface ListaPeriodoAporte {
    idAportePago: string;
    periodoAportacion: string;
    indEstadoPago: string;
    tipoPagoAporte: string;
    tipoMoneda: string;
    aportePeriodo: number;
    montoPagoAporte: number
    saldoAporte: number
    recargoMora: number
    totalPagar: number
    totalPagarSunat: number
    montoPagoDecla: number
    montoSaldoDecla: number
    fechaInicioDecla: string
    fechaFinDecla: string

    checked: boolean
    indTipoPeri: string
}