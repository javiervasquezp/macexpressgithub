import { AfiliadoFacultativo } from "./afiliado-facultativo.model";
import { ListaPeriodoAporte } from "./lista-periodo-aporte.model";

export interface PeriodoPagoResponse {
    listaPeriodoAporte: ListaPeriodoAporte[];
    afiliadoFacultativo: AfiliadoFacultativo;
    numTotalPeriodos: number;
}