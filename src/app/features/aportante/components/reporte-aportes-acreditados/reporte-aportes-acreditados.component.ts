import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { SendReporteAportesRequest } from '@core/models/aportante.model';
import { DatosPersonales, TiposDocumentoIdentidad } from '@core/models/tipos.model';
import { AportanteService } from '@features/aportante/services/aportante.service';
import { UtilsService } from '@services/utils.service';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';
import { UsuarioComponent } from '@shared/components/usuario/usuario.component';
import { CatalogoService } from '@shared/services/catalogo.service';
import { AuthService } from 'app/auth/services/auth.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reporte-aportes-acreditados',
  imports: [
    CommonModule,
    AlertaComponent,
    UsuarioComponent,
    FormsModule
  ],
  templateUrl: './reporte-aportes-acreditados.component.html',
  styleUrl: './reporte-aportes-acreditados.component.css'
})
export class ReporteAportesAcreditadosComponent implements OnInit {

  applicationConstants: any = CoreConstants;
  warning: string = "";
  listaTipoDocumento = new Array();
  nombreReporte: string = "";
  loading: boolean = false;
  contenidoReporte: string = "";
  idTipoDocumento: string = "0";
  numeroDocumento: string = "";
  descTipoDocumento: string = "";
  consultaExitosa: boolean = false;
  tiposDocumentoIdentidad!: TiposDocumentoIdentidad[] | undefined;
  coreConstante = CoreConstants;
  datosPersonales: DatosPersonales | null = null;
  envioCorreoExitoso: boolean = false;
  warningEnvioCorreo: string = "";
  mailPopup: string = "";
  modalRef?: BsModalRef;

  private readonly utilSvc = inject(UtilsService);
  private readonly aportanteSvc = inject(AportanteService);
  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  private readonly catalogoSvc = inject(CatalogoService);
  private readonly modalService = inject(BsModalService);

  ngOnInit(): void {
    if (this.authSvc.isAuthenticate()) {
      this.tiposDocumentoIdentidad = this.catalogoSvc.getTiposDocumentosidentidadFromStorage();
      this.selecionarMenuItem(CoreConstants.Rutas.reporteAportes)
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

  BuscarDatosPersonalesReporte() {
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
    var request = {
      TipoDocumentoId: Number.parseInt(this.idTipoDocumento),
      NumeroDocumento: this.numeroDocumento
    }

    this.aportanteSvc.obtenerDatosPersonalesReporteAcreditados(request).subscribe(
      {
        next: (res: any) => {
          // debugger;
          // console.log(res);
          let resultado = this.evaluarRespuesta(res);
          if (resultado != null) {
            this.datosPersonales = resultado as DatosPersonales;
            //console.log(this.datosPersonales);
            var tipoDocu = this.tiposDocumentoIdentidad?.filter((tipoDoc) => tipoDoc.IdTipoDocumento == this.datosPersonales?.TipoDocumentoId)[0].DescripcionTipoDocumento;
            this.descTipoDocumento = tipoDocu != undefined || tipoDocu != null ? tipoDocu : "";
          }
        },
        error: (err: any) => {
          this.warning = `<p class='alert__info'>${err}</p>`;

        }
      }
    );
  }

  generarReporte() {
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

    const request: SendReporteAportesRequest = {
      TipoDocumentoId: this.datosPersonales?.TipoDocumentoId != null ? this.datosPersonales?.TipoDocumentoId : 0,
      NumeroDocumento: this.datosPersonales?.NumeroDocumento != null ? this.datosPersonales?.NumeroDocumento : "",
      Nombres: this.datosPersonales?.Nombre != null ? this.datosPersonales?.Nombre : "",
      NombreEntidad: "Municipalidad Provincial De Chepen",
      NombreArchivo: "",
      Correo: ""
    };

    this.aportanteSvc.postAporteAcreditados(request).subscribe(
      {
        next: (res: any) => {
          //debugger;
          //console.log(res);
          let resultado = this.evaluarRespuesta(res);
          if (resultado != null) {
            this.nombreReporte = resultado.nombre;
            this.contenidoReporte = resultado.contenido;
            this.consultaExitosa = true;
            this.descargarReporte();
          }
        },
        error: (err: any) => {
          this.warning = `<p class='alert__info'>${err}</p>`;

        }
      }
    );
  }

  enviarCorreoReporte() {

    this.warningEnvioCorreo = "";
    //debugger;
    if (this.datosPersonales == null) {
      this.warningEnvioCorreo = this.coreConstante.Mensajes.AportanteNoSeleccionado;
      return;
    }
    else if (this.mailPopup.trim().length < 1 || !this.utilSvc.esCorreoValido(this.mailPopup)) {
      this.warningEnvioCorreo = this.coreConstante.Mensajes.CorreoInvalido;
      return
    }

    const request: SendReporteAportesRequest = {
      TipoDocumentoId: this.datosPersonales?.TipoDocumentoId != null ? this.datosPersonales?.TipoDocumentoId : 0,
      NumeroDocumento: this.datosPersonales?.NumeroDocumento != null ? this.datosPersonales?.NumeroDocumento : "",
      Nombres: this.datosPersonales?.Nombre != null ? this.datosPersonales?.Nombre : "",
      NombreEntidad: "Municipalidad Provincial De Chepen",
      NombreArchivo: this.tiposDocumentoIdentidad?.filter(
        (tipoDoc) => tipoDoc.IdTipoDocumento.toString() == this.idTipoDocumento
      )[0].DescripcionTipoDocumento.replaceAll(".", "").replaceAll(" ", "_") + "_" +
        this.numeroDocumento + "_" + CoreConstants.NombresReportes.aportesAcreditados,
      Correo: this.mailPopup
    };

    this.aportanteSvc.postSendCorreoAporteAcreditados(request).subscribe(
      {
        next: (res: any) => {
          // debugger;
          // console.log(res);
          let resultado = this.evaluarRespuesta(res);
          if (resultado != null) {
            this.envioCorreoExitoso = true;;
          }
        },
        error: (err: any) => {
          this.warning = `<p class='alert__info'>${err}</p>`;
        }
      }
    );
  }

  descargarReporte() {
    const blobData = this.utilSvc.convertBase64ToBlobData(this.contenidoReporte);
    const blob = new Blob([blobData], { type: CoreConstants.ContentTypeFiles.contentTypePDF });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.tiposDocumentoIdentidad?.filter(
      (tipoDoc) => tipoDoc.IdTipoDocumento.toString() == this.idTipoDocumento
    )[0].DescripcionTipoDocumento.replaceAll(".", "").replaceAll(" ", "_") + "_" +
      this.numeroDocumento + "_" + CoreConstants.NombresReportes.aportesAcreditados;
    link.click();
  }

  limpiar(idTipoDoc: string = "0") {
    //debugger;
    this.contenidoReporte = "";
    this.nombreReporte = "";
    this.warning = "";
    this.numeroDocumento = ""
    this.idTipoDocumento = idTipoDoc;
    this.consultaExitosa = false;
    this.descTipoDocumento = "";
    this.datosPersonales = null;
  }

  tipoDocSelectChange(): void {
    //console.log(event)
    //debugger;
    this.numeroDocumento = "";
    if (Number.parseInt(this.idTipoDocumento) == 0) {
      this.limpiar("0");
    }
    else {
      this.warning = "";
    }
  }

  evaluarRespuesta(res: any) {
    if (res.IsSuccess == true) {
      switch (res.Codigo) {
        case CoreConstants.CodigoRespuesta.OperacionExitosa:
          return res.Result;
        case CoreConstants.CodigoRespuesta.OperacionNoEjecutada:
          this.warning = res.Message; break;
        case CoreConstants.CodigoRespuesta.ErrorNoControlado:
          this.warning = CoreConstants.Mensajes.NoHayConexion; break;
        case CoreConstants.CodigoRespuesta.OperacionIncorrectaDatos:
          this.warning = CoreConstants.Mensajes.SinDatos; break;
        case CoreConstants.CodigoRespuesta.NoAutorizado:
          this.warning = res.Message; break;
        case CoreConstants.CodigoRespuesta.CambioClave:
          this.warning = res.Message; break;
      }
    } else {
      this.warning = res.Message;
    }
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

  closeModal() {
    this.modalRef?.hide();
    this.envioCorreoExitoso = false;
    this.warningEnvioCorreo = "";
    this.mailPopup = "";
  }
}
