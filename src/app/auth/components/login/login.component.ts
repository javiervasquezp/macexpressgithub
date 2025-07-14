import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as forge from 'node-forge';
import { CoreConstants } from '@core/constants/core.constant';
import { LogIngRequest } from '@core/models/auth.modes';
import { ProcessResult } from '@core/models/response.model';
import { UserService } from '@services/user.service';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';
import { AuthService } from 'app/auth/services/auth.service';
import { UtilsService } from '@services/utils.service';
import { Router } from '@angular/router';
import { CatalogoService } from '@shared/services/catalogo.service';
import { TiposDocumentoIdentidad } from '@core/models/tipos.model';
import { ApplicationConstants } from '@shared/constants/application.constants';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AlertaComponent,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit {
  warning: string = "";
  idTipoDocumento: string = "0";
  numeroDocumento: string = "";
  maxLengthDni: number = 15;
  maxLengthClave: number = 6;
  clave: string = "";
  tiposDocumentoIdentidad!: TiposDocumentoIdentidad[] | undefined;

  publicKey: string = `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDsMd37llJw4NLq57498yjhU3Z
  lsZGYOUqRArapO/SI7ajdQ8n4C/7hK+kXFNR7P1wCE5FmJ1KL4YOxEEG3+RcG37K
  Hx9qvk328ciVMlNQgKKNpX3sKSegyp+vRFLS/xpfgq7lTMxKl0RPc4avnAOcM6vA
  YCF0lN/+QKAR7IiwOQIDAQAB
  -----END PUBLIC KEY-----`;

  private readonly authSvc = inject(AuthService);
  private readonly usersvc = inject(UserService);
  private readonly utilsvc = inject(UtilsService);
  private readonly catalogoSvc = inject(CatalogoService);
  private readonly router = inject(Router);
  private toastr = inject(ToastrService);

  constructor() {
  }

  ngOnInit(): void {
    this.usersvc.setLogOut();
    this.catalogoSvc.removeTiposDocumentosidentidadFromStorage();
    this.obtenerCatalogos();
  }

  login() {
    this.warning = "";

    //debugger;

    if (Number.parseInt(this.idTipoDocumento) > 0 && this.numeroDocumento.length > 0 && this.clave.length > 0) {
      var logInRequest = new LogIngRequest();

      logInRequest.TipoDocumentoId = Number.parseInt(this.idTipoDocumento);
      logInRequest.NumeroDocumento = this.numeroDocumento;

      var rsa = forge.pki.publicKeyFromPem(this.publicKey);
      var encryptedPassword = window.btoa(rsa.encrypt(this.clave));
      logInRequest.Clave = encryptedPassword;

      this.authSvc.login(logInRequest).subscribe(
        {
          next: (response: ProcessResult<String>) => {
            //debugger;

            let result = this.evaluarRespuesta(response);

            if (this.utilsvc.stringIsvalid(result)) {
              this.usersvc.setToken(result);
              this.router.navigateByUrl(CoreConstants.Rutas.boletasDePago);
            }
          },
          error: (error: any) => {
            this.warning = `<p class='alert__info'>${error}</p>`;
          },
          complete: () => {

          }
        }
      );
    }
    else {
      this.warning = `<p class='alert__info'>${CoreConstants.Mensajes.SeleccionarDatosIdentidad}</p>`;
    }
  }

  obtenerCatalogos() {

    this.catalogoSvc.getTiposDocumentosIdentidad()
      .subscribe((res: any) => {
        //debugger;
        //console.log(res.Result);
        let resultado = this.evaluarRespuestaCatalogo(res);        
        
        if(resultado != null && resultado != undefined){
          this.catalogoSvc.setStorageTiposDocumentos(resultado as TiposDocumentoIdentidad[]);
          this.tiposDocumentoIdentidad = resultado as TiposDocumentoIdentidad[];
          //console.log(this.tiposDocumentoIdentidad);
        }        
      }, (err: any) => {
        this.toastr.error(err, CoreConstants.TitulosToastr.Error);
      });
  }

  tipoDocSelectChange(): void {
    //console.log(event)
    //debugger;
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
    this.numeroDocumento = "";
    this.idTipoDocumento = idTipoDoc;
  }

  evaluarRespuesta(res: any) {
    if (res.IsSuccess == true) {
      switch (res.Codigo) {
        case CoreConstants.CodigoRespuesta.OperacionExitosa:
          return res.ResultToken;
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

  evaluarRespuestaCatalogo(res:any){
    if (res.IsSuccess == true) {
      switch (res.Codigo) {
          case CoreConstants.CodigoRespuesta.OperacionExitosa: 
            return res.Result;
          case CoreConstants.CodigoRespuesta.OperacionNoEjecutada: 
              this.toastr.warning(res.Message,CoreConstants.TitulosToastr.Warning); 
              break;
          case CoreConstants.CodigoRespuesta.ErrorNoControlado: 
              this.toastr.error(CoreConstants.Mensajes.NoHayConexion,CoreConstants.TitulosToastr.Error); 
              break;
          case CoreConstants.CodigoRespuesta.OperacionIncorrectaDatos: 
              this.toastr.warning(res.Message,CoreConstants.TitulosToastr.Warning); 
              break;
          case CoreConstants.CodigoRespuesta.NoAutorizado: 
              this.toastr.warning(CoreConstants.Mensajes.NoAutorizado,CoreConstants.TitulosToastr.Warning); 
              break;
      }
    }else{
        this.warning = res.Message;
        this.toastr.error(res.Message, CoreConstants.TitulosToastr.Error);
    }
  }

  dniNumberOnly(event: any): boolean {
    //debugger;
    let valido: boolean = true;
    const charCode = (event.which) ? event.which : event.keyCode;

    if (this.idTipoDocumento == ApplicationConstants.tipoDocumentoId.DNI.toString() ||
      this.idTipoDocumento == ApplicationConstants.tipoDocumentoId.PTP.toString() ||
      this.idTipoDocumento == ApplicationConstants.tipoDocumentoId.CarneExtranjeria.toString()) {

      if (this.idTipoDocumento == ApplicationConstants.tipoDocumentoId.DNI.toString() &&
        this.numeroDocumento.length >= ApplicationConstants.TipoDocumentoLenght.DNI) {
        return false;
      }
      else if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
      }
    }

    return valido;
  }
}
