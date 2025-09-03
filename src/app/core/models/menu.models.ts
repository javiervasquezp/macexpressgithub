export class MenuPrincipalModel {
    Id: string  = ""; 
    NombrePerfil: string | null = null; 
    ListaMenu: MenuModel[] | [] = [];
}
export class MenuModel {
    IdServicio: number | null = null;
    Tamanio: number = 10;
    NombreServicio: string | null = null;
    Icono: string | null = null;
    Detalle: DetalleMenuModel[] | null = null;
}

export class DetalleMenuModel {
    IdServicio: number | null = null;
    CodigoServicio: number | null = null;
    NombreServicio: string | null = null;
    Icono: string | null = null;
    IsExterno: string | null = null;
    Url: string | null = null;
    Detalle: DetalleMenuModel[] | null = null;
    Accion: DetalleAccionModel[] | null = null;
    Seleccionado: boolean = false;
}
export class DetalleAccionModel {
    CodigoAccion: string | null = null;
    NombreAccion: string | null = null;
}