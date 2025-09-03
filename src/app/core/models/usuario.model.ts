export interface Usuario {  
    IdSession: string;
    UserId: string;
    NumDoc: string;
    TypeDoc: string;
    TypeUser: string;
    Nombre: string;
    ApellidoPaterno: string
    ApellidoMaterno: string;
    TypeDocDesc: string;
    DateSearchUtc: string;
    DateUpdateUtc: string;
    Correo: string;
    CodCelularPais: string;
    Celular: string;
    IdTituloRepresentacion: string;
    TituloRepresentacion: string;
    TipoDocumentoPerJuridicaId: string;
    TipoDocumentoPerJuridica: string;
    NumeroDocumentoPerJuridica: string;
    RazonSocialPerJuridica: string;
    horaInicioUtc: string;
    horaFinUtc: string;
    exp: string;
    iss: string;
    aud: string;
}