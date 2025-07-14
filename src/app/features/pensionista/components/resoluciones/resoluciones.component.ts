import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { ImprimirResolucion, Resolucion } from '@core/models/pensionista.models';
import { ProcessResult } from '@core/models/response.model';
import { TiposDocumentoIdentidad } from '@core/models/tipos.model';
import { PensionistaService } from '@features/pensionista/services/pensionista.service';
import { UtilsService } from '@services/utils.service';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';
import { FechasComponent } from '@shared/components/fechas/fechas.component';
import { UsuarioComponent } from '@shared/components/usuario/usuario.component';
import { CatalogoService } from '@shared/services/catalogo.service';
import { AuthService } from 'app/auth/services/auth.service';

@Component({
  selector: 'app-resoluciones',
  standalone: true,
  imports: [
    CommonModule,
    AlertaComponent,
    FormsModule,
    UsuarioComponent,
    FechasComponent
  ],
  templateUrl: './resoluciones.component.html',
  styleUrl: './resoluciones.component.css'
})
export class ResolucionesComponent implements OnInit {

  warning: string = "";
  idTipoDocumento: string = "0";
  numeroDocumento: string = "";
  nombreCompleto: string = "";
  consultaExitosa: boolean = false;
  tipoDocumento: string = "";
  resoluciones: Resolucion[] = [];
  fechaconsulta: string = "";

  pensionistaSvc = inject(PensionistaService);
  authSvc = inject(AuthService);
  router = inject(Router);
  tiposDocumentoIdentidad!: TiposDocumentoIdentidad[] | undefined;
  coreConstante = CoreConstants;

  private readonly utilSvc = inject(UtilsService);
  private readonly catalogoSvc = inject(CatalogoService);

  ngOnInit(): void {
    if (this.authSvc.isAuthenticate()) {
      this.tiposDocumentoIdentidad = this.catalogoSvc.getTiposDocumentosidentidadFromStorage();
      this.selecionarMenuItem(CoreConstants.Rutas.resoluciones)
    }
    else {
      this.router.navigateByUrl(CoreConstants.Rutas.login);
    }
  }

  listarResoluciones() {
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

    this.pensionistaSvc
      .getResoluciones(Number.parseInt(this.idTipoDocumento), this.numeroDocumento)
      .subscribe(
        {
          next: (response: ProcessResult<Resolucion[]>) => {
            //debugger;                
            var result = this.evaluarRespuesta(response);
            if (result != null && result.length > 0) {
              this.resoluciones = result as Resolucion[];
              console.log(this.resoluciones);

              this.fechaconsulta = this.resoluciones.length > 0 ? response.Fecha : "";
              this.nombreCompleto = this.resoluciones.length > 0 ? this.resoluciones[0].NombresCompleto : "";
              this.tipoDocumento = this.resoluciones.length > 0 ? this.resoluciones[0].TipoDocumentoAbrev : "";
              this.consultaExitosa = this.resoluciones.length > 0;
            }
            else if (result != null && result.length < 1) {
              this.warning = `<p class='alert__info'>${CoreConstants.Mensajes.SinDatos}</p>`;
            }
          },
          error: (err: any) => {
            this.warning = `<p class='alert__info'>${err}</p>`;
          }
        }
      );
  }

  imprimir(resolucion: Resolucion) {

    var objImprimir: ImprimirResolucion = {} as ImprimirResolucion;

    objImprimir.TipoDocumentoId = Number.parseInt(this.idTipoDocumento);
    objImprimir.NumeroDocumento = this.numeroDocumento;
    objImprimir.Appcode = CoreConstants.AplicacionCode.MacExpressCode;
    objImprimir.ResolucionResp = resolucion;

    this.pensionistaSvc.imprimirResolucion(objImprimir).subscribe(
      {
        next: (response: any) => {
          //debugger;
          let resultado = this.evaluarRespuesta(response);
          if (resultado != null && resultado.Archivo != null) {
            const blobData = this.utilSvc.convertBase64ToBlobData(resultado.Archivo);
            const blob = new Blob([blobData], { type: CoreConstants.ContentTypeFiles.contentTypePDF });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.tiposDocumentoIdentidad?.filter(
                (tipoDoc) => tipoDoc.IdTipoDocumento.toString() == this.idTipoDocumento
              )[0].DescripcionTipoDocumento.replaceAll(".", "").replaceAll(" ", "_") + "_" + 
                              this.numeroDocumento + "_" + this.coreConstante.NombresReportes.resolucion;
            link.click();
          }
        },
        error: (err: any) => {
          this.warning = `<p class='alert__info'>${err}</p>`;

        }
      }
    );
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

  tipoDocSelectChange(): void {
    //console.log(event)
    //debugger;
    this.numeroDocumento = "";
    if (Number.parseInt(this.idTipoDocumento) == 0) {
      this.limpiarCampos("0");
    }
    else {
      this.warning = "";
    }
  }

  limpiarCampos(idTipoDoc: string = "0") {
    //debugger;
    this.warning = "";
    this.idTipoDocumento = idTipoDoc;
    this.numeroDocumento = "";
    this.nombreCompleto = "";
    this.consultaExitosa = false;
  }

  evaluarRespuesta(res: any) {
    if (res.IsSuccess == true) {
      //debugger;
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
          this.warning = CoreConstants.Mensajes.NoAutorizado; break;
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
}
