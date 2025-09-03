import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { BoletasPagoModel, BoletasPagosModel, DatosCabeceraModel, SendConstanciaPagoRequest } from '@core/models/pensionista.models';
import { ProcessResult } from '@core/models/response.model';
import { TiposDocumentoIdentidad } from '@core/models/tipos.model';
import { PensionistaService } from '@features/pensionista/services/pensionista.service';
import { UtilsService } from '@services/utils.service';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';
import { FechasComponent } from '@shared/components/fechas/fechas.component';
import { UsuarioComponent } from '@shared/components/usuario/usuario.component';
import { CatalogoService } from '@shared/services/catalogo.service';
import { AuthService } from 'app/auth/services/auth.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-boletas-pago',
    imports: [
        CommonModule,
        AlertaComponent,
        UsuarioComponent,
        FechasComponent,
        FormsModule
    ],
    templateUrl: './boletas-pago.component.html',
    styleUrl: './boletas-pago.component.css'
})
export class BoletasPagoComponent implements OnInit {
    warning: string = "";
    idRegimen: string = "";
    DetalleRegimenes: any[] = [];
    DetalleRegimenesFilter: any[] = [];
    BoletasPagos: any[] = [];
    ListaBoletasPagos: any[] = [];
    ListaBoletasPagosTitle: any[] = [];
    numeroDocumento: string = "";
    idTipoDocumento: string = "0";
    nombreCompleto: string = "";
    tipoDocumento: string = "";
    fechaconsulta: string = "";
    cabecera!: any;
    consultaExitosa: boolean = false;
    envioCorreoExitoso: boolean = false;
    tiposDocumentoIdentidad!: TiposDocumentoIdentidad[] | undefined;
    periodoPopup: string = "";
    montoPopup: string = "";
    mailPopup: string = "";
    boletaPagoSelected: BoletasPagosModel | null = null;
    warningEnvioCorreo: string = "";
    coreConstante = CoreConstants;

    modalRef?: BsModalRef;

    private readonly pensionistaSvc = inject(PensionistaService);
    private readonly utilSvc = inject(UtilsService);
    private readonly authSvc = inject(AuthService);
    private readonly router = inject(Router);
    private readonly catalogoSvc = inject(CatalogoService);
    private readonly modalService = inject(BsModalService);

    ngOnInit(): void {
        if (this.authSvc.isAuthenticate()) {
            this.tiposDocumentoIdentidad = this.catalogoSvc.getTiposDocumentosidentidadFromStorage();
            this.selecionarMenuItem(CoreConstants.Rutas.boletasDePago)
        }
        else {
            this.router.navigateByUrl(CoreConstants.Rutas.login);
        }
    }

    private selecionarMenuItem(selectItem: string): void {
        var menus = document.getElementById("ulMenu")?.getElementsByTagName("li");

        if (menus != null || menus != undefined) {
            //debugger;
            for (var i = 0; i < menus?.length; i++) {
                if (menus[i].id === selectItem) {
                    menus[i].classList.remove("ul-menu-li");
                    menus[i].classList.add("ul-menu-selected-li");
                }
                else {
                    menus[i].classList.add("ul-menu-li");
                    menus[i].classList.remove("ul-menu-selected-li");
                }
            }
        }
        //console.log(menus);

        var menusMovil = document.getElementById("ulMenuMovil")?.getElementsByTagName("li");

        if (menusMovil != null || menusMovil != undefined) {
            //debugger;
            for (var i = 0; i < menusMovil?.length; i++) {
                if (menusMovil[i].id === selectItem) {
                    menusMovil[i].classList.remove("ul-menu-li");
                    menusMovil[i].classList.add("ul-menu-selected-li");
                }
                else {
                    menusMovil[i].classList.add("ul-menu-li");
                    menusMovil[i].classList.remove("ul-menu-selected-li");
                }
            }
        }
    }

    verConstancias() {

        this.warning = "";

        if (Number.parseInt(this.idTipoDocumento) == 0 && this.numeroDocumento.length == 0) {
            this.warning = `<p class='alert__info'>${CoreConstants.Mensajes.SeleccionarDatosIdentidad}</p>`;
            return;
        }
        else if (Number.parseInt(this.idTipoDocumento) == CoreConstants.TipoDocumentoClaveVirtual.DNI &&
            this.numeroDocumento.length < CoreConstants.TipoDocumentoLenght.DNI) {
            this.warning = `<p class='alert__info'>${CoreConstants.Mensajes.DNIInvalido}</p>`;
            return;
        }
        else if (Number.parseInt(this.idTipoDocumento) != CoreConstants.TipoDocumentoClaveVirtual.DNI &&
            this.numeroDocumento.length < 1) {
            this.warning = `<p class='alert__info'>${CoreConstants.Mensajes.OtroTipoDocumentoInvalido}</p>`;
            return;
        }

        this.pensionistaSvc.getConstanciaPagoByDocumentoIdentidad(this.idTipoDocumento, this.numeroDocumento)
            .subscribe(
                {
                    next: (response: ProcessResult<BoletasPagoModel>) => {
                        //debugger;
                        let resultado = this.evaluarRespuesta(response) as ProcessResult<BoletasPagoModel>;

                        if (resultado != null && resultado.Result != null && resultado.Result.UltimosPagos != null) {
                            this.fechaconsulta = resultado.Fecha;
                            this.DetalleRegimenes = resultado.Result.UltimosPagos.DetalleRegimenes;
                            //console.log(this.DetalleRegimenes);
                            this.BoletasPagos = resultado.Result.BoletasPagos;
                            this.cabecera = resultado.Result.UltimosPagos.DatosCabecera as DatosCabeceraModel;
                            this.tipoDocumento = this.utilSvc.getNombreTipoDocumentoFromNspIdTipoDocumento(this.cabecera.SiglaTipoDocumentoIdentidad);
                            this.numeroDocumento = this.cabecera.NumeroDocumentoIdentidad;
                            this.nombreCompleto = `${this.cabecera.Nombres} ${this.cabecera.ApellidoPaterno} ${this.cabecera.ApellidoMaterno}`;
                            this.consultaExitosa = true;
                            if (this.DetalleRegimenes != null && this.BoletasPagos != null) {

                                this.setearDefault();
                                //console.log(this.ListaBoletasPagos);

                            }
                        }
                    },
                    error: (err: any) => {
                        this.warning = `<p class='alert__info'>${err}</p>`;

                    }
                }
            );
    }

    onChangeListarRegimen() {

        this.ListaBoletasPagos = [];
        this.DetalleRegimenesFilter = this.DetalleRegimenes.filter((item: any) => item.Regimen == this.idRegimen);
        this.DetalleRegimenesFilter.forEach((item: any, index: number) => {
            item.DetalleRegimenCuentas.forEach((item2: any) => {
                const resultado = this.BoletasPagos.filter((item3: any) => item3.numRegLey == item.Regimen && item3.descripcionCuenta == item2.Cuenta)
                this.ListaBoletasPagos.push(resultado);
            });
        });
    }

    onClickPrint() {
        window.print();
        //imprimir('Print');
    }

    onClickdescargaPDF(item: any) {
        debugger;
        //console.log(item);
        var fecEmision: String = item.desEmision;

        const request: SendConstanciaPagoRequest = {
            TipoDocumentoId: this.idTipoDocumento,
            NumeroDocumento: this.numeroDocumento,
            NumReg: item.numRegLey,
            Cuenta: item.descripcionCuenta,
            Emision: item.numEmision,
            CodProceso: item.codProc,
            ISubProc: item.inSubProceso,
            Nombres: this.cabecera.Nombres,
            NombreEntidad: "Municipalidad Provincial De Chepen",
            NombreArchivo: this.tiposDocumentoIdentidad?.filter(
                (tipoDoc) => tipoDoc.IdTipoDocumento.toString() == this.idTipoDocumento
            )[0].DescripcionTipoDocumento.replaceAll(".", "").replaceAll(" ", "_") + "_" +
                this.numeroDocumento + "_" + this.coreConstante.NombresReportes.boletasPago + "_" +
                fecEmision.replaceAll(" ", ""),
            Correo: "",
            Periodo: item.desEmision.trim()
        };

        this.pensionistaSvc.obtenerBoletaPagoPdf(request).subscribe(
            {
                next: (response: any) => {
                    //debugger;
                    let resultado = this.evaluarRespuesta(response);
                    if (resultado != null && resultado.Result != null) {
                        const blobData = this.utilSvc.convertBase64ToBlobData(resultado.Result);
                        const blob = new Blob([blobData], { type: CoreConstants.ContentTypeFiles.contentTypePDF });
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = request.NombreArchivo;
                        link.click();
                    }
                },
                error: (err: any) => {
                    this.warning = `<p class='alert__info'>${err}</p>`;

                }
            }
        );
    }

    onSendMailPDF(template: TemplateRef<any>, item: any) {
        // debugger;
        // console.log(item);
        this.boletaPagoSelected = item as BoletasPagosModel;
        this.periodoPopup = this.boletaPagoSelected.desEmision.trim();
        this.montoPopup = this.boletaPagoSelected.montoPagoBruto.trim();

        this.openModal(template);
    }

    openModal(template: TemplateRef<any>) {
        const config: ModalOptions = {
            // Evita cierre con click en el backdrop
            ignoreBackdropClick: true,
            // Evita cierre con la tecla ESC
            keyboard: false,
            // Clases para tamaño y centrar verticalmente
            class: 'modal-md modal-dialog-centered'
        };

        this.modalRef = this.modalService.show(template, config);
    }

    sendMailClick() {
        this.warningEnvioCorreo = "";
        debugger;
        if (this.boletaPagoSelected == null) {
            this.warningEnvioCorreo = this.coreConstante.Mensajes.RegistroNoSeleccionado;
            return;
        }
        else if (this.mailPopup.trim().length < 1 || !this.utilSvc.esCorreoValido(this.mailPopup)) {
            this.warningEnvioCorreo = this.coreConstante.Mensajes.CorreoInvalido;
            return
        }

        var fecEmision: String = this.boletaPagoSelected != null ? this.boletaPagoSelected.desEmision : "";
        const request: SendConstanciaPagoRequest = {
            TipoDocumentoId: "",
            NumeroDocumento: "",
            NumReg: this.boletaPagoSelected.numRegLey,
            Cuenta: this.boletaPagoSelected.descripcionCuenta,
            Emision: this.boletaPagoSelected.numEmision,
            CodProceso: this.boletaPagoSelected.codProc,
            ISubProc: this.boletaPagoSelected.inSubProceso,
            Nombres: this.cabecera.Nombres,
            NombreEntidad: "Municipalidad Provincial De Chepen",
            NombreArchivo: this.tiposDocumentoIdentidad?.filter(
                (tipoDoc) => tipoDoc.IdTipoDocumento.toString() == this.idTipoDocumento
            )[0].DescripcionTipoDocumento.replaceAll(".", "").replaceAll(" ", "_") + "_" +
                this.numeroDocumento + "_" + this.coreConstante.NombresReportes.boletasPago + "_" +
                fecEmision.replaceAll(" ", ""),
            Correo: this.mailPopup,
            Periodo: this.periodoPopup
        };
        console.log(request);

        this.pensionistaSvc.sendMailBoletaPagoPdf(request).subscribe(
            {
                next: (response: any) => {
                    //debugger;
                    //console.log(response);
                    let resultado = this.evaluarRespuestaEnvioCorreo(response);
                    if (resultado != null) {
                        //console.log(resultado);
                        this.envioCorreoExitoso = true;
                    }
                },
                error: (err: any) => {
                    this.warningEnvioCorreo = err;

                }
            }
        );
    }

    closeModal() {
        this.modalRef?.hide();
        this.boletaPagoSelected = null;
        this.periodoPopup = "";
        this.montoPopup = "";
        this.mailPopup = "";
        this.envioCorreoExitoso = false;
        this.warningEnvioCorreo = "";
    }

    tipoDocSelectChange(): void {
        //debugger;
        this.numeroDocumento = "";
        if (Number.parseInt(this.idTipoDocumento) == 0) {
            this.limpiarCampos("0");
        }
        else {
            this.warning = "";
        }
    }

    listarBoletas() {
        this.verConstancias();
    }

    evaluarRespuesta(res: any) {
        if (res.IsSuccess == true) {
            switch (res.Codigo) {
                case CoreConstants.CodigoRespuesta.OperacionExitosa:
                    return res;
                case CoreConstants.CodigoRespuesta.OperacionNoEjecutada:
                    this.warning = res.Message; break;
                case CoreConstants.CodigoRespuesta.ErrorNoControlado:
                    this.warning = CoreConstants.Mensajes.NoHayConexion; break;
                case CoreConstants.CodigoRespuesta.OperacionIncorrectaDatos:
                    this.warning = res.Message; break;
                case CoreConstants.CodigoRespuesta.NoAutorizado:
                    this.warning = CoreConstants.Mensajes.NoAutorizado; break;
                case CoreConstants.CodigoRespuesta.CambioClave:
                    this.warning = res.Message; break;
            }
        } else {
            this.warning = res.Message;
        }
    }

    evaluarRespuestaEnvioCorreo(res: any) {
        if (res.IsSuccess == true) {
            switch (res.Codigo) {
                case CoreConstants.CodigoRespuesta.OperacionExitosa:
                    return res;
                case CoreConstants.CodigoRespuesta.OperacionNoEjecutada:
                    this.warningEnvioCorreo = res.Message; break;
                case CoreConstants.CodigoRespuesta.ErrorNoControlado:
                    this.warningEnvioCorreo = CoreConstants.Mensajes.NoHayConexion; break;
                case CoreConstants.CodigoRespuesta.OperacionIncorrectaDatos:
                    this.warningEnvioCorreo = res.Message; break;
                case CoreConstants.CodigoRespuesta.NoAutorizado:
                    this.warningEnvioCorreo = CoreConstants.Mensajes.NoAutorizado; break;
                case CoreConstants.CodigoRespuesta.CambioClave:
                    this.warningEnvioCorreo = res.Message; break;
            }
        } else {
            this.warningEnvioCorreo = res.Message;
        }
    }

    setearDefault() {
        let regimen = this.DetalleRegimenes.find(x => x.Regimen == "19990");
        if (regimen != undefined)
            this.idRegimen = "19990";
        else
            this.idRegimen = this.DetalleRegimenes[0].Regimen;

        this.onChangeListarRegimen();
    }

    limpiarCampos(idTipoDoc: string = "0") {
        //debugger;
        this.warning = "";
        this.DetalleRegimenes = [];
        this.BoletasPagos = [];
        this.cabecera = null;
        this.tipoDocumento = "";
        this.idTipoDocumento = idTipoDoc;
        this.numeroDocumento = "";
        this.nombreCompleto = "";
        this.consultaExitosa = false;
    }

    dniNumberOnly(event: any): boolean {
        var valid = true;

        if (Number.parseInt(this.idTipoDocumento) == CoreConstants.TipoDocumentoClaveVirtual.DNI) {
            const charCode = (event.which) ? event.which : event.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                valid = false;
            }

            if (Number.parseInt(this.idTipoDocumento) == CoreConstants.TipoDocumentoClaveVirtual.DNI &&
                this.numeroDocumento.trim().length > (CoreConstants.TipoDocumentoLenght.DNI - 1)) {
                valid = false;
            }
        }

        return valid;
    }
}
