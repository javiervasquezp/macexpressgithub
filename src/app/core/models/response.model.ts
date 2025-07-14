export class ProcessResult<T extends object> {
    IsSuccess: boolean = false;
    Message: string = "";
    Exception: any | null;
    Result: T | null = null;
    Fecha: string = "";
    Codigo: string = "";
}

