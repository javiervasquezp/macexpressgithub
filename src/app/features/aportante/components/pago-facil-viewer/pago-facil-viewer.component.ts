import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { CoreConstants } from '@core/constants/core.constant';
import { AfiliadoFacultativo } from '@core/models/afiliado-facultativo.model';
import { ListaPeriodoAporte } from '@core/models/lista-periodo-aporte.model';
import { AportanteService } from '@features/aportante/services/aportante.service';
import { AlertaComponent } from '@shared/components/alerta/alerta.component';
import { PeriodoPagoResponse } from '@core/models/periodo-pago-response.model';
import { AuthService } from 'app/auth/services/auth.service';
import { Router } from '@angular/router';
import { TiposDocumentoIdentidad } from '@core/models/tipos.model';
import { CatalogoService } from '@shared/services/catalogo.service';

@Component({
  selector: 'app-pago-facil-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AlertaComponent,
    PaginationModule
  ],
  templateUrl: './pago-facil-viewer.component.html',
  styleUrl: './pago-facil-viewer.component.scss'
})
export class PagoFacilViewerComponent implements OnInit {
  numeroDocumento: string = "";
  idTipoDocumento: string = "0";

  warning: string = "";
  afiliadoFacultativo!: AfiliadoFacultativo;
  listaAportes: ListaPeriodoAporte[] = [];
  listaAportesObligatorioMostrar: ListaPeriodoAporte[] = [];
  listaAportesAdicionalesMostrar: ListaPeriodoAporte[] = [];
  listaTipoDocumento = null;

  nombreAfiliado: string = ''
  activaInputAporteO: string = ''
  activaInputAporteA: string = ''

  itemsPorPagina: number = 20;
  numeroPagina: number = 1;
  totalRegistros!: number;

  valorAporteObligatorio: string = '0';
  valorAporteAdicional: string = '1';

  imagenPDF!: string;
  imagenPageAfter!: string;
  imagenPageNext!: string;
  imagenPageFin!: string;
  imagenPageIni!: string;
  imagenAportes!: string;
  tipoAporteSeleccionado: string = '0';
  consultaExitosa: boolean = false;
  
  tiposDocumentoIdentidad!: TiposDocumentoIdentidad[] | undefined;
  listaAportesObligaSelecionados: ListaPeriodoAporte[] = [];
  listaAportesAdicionalesSelecionados: ListaPeriodoAporte[] = [];

  myOptions: any = {
    'display': false
  };
  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  private readonly catalogoSvc = inject(CatalogoService);

  @ViewChild('myTabAA') myTabAA!: ElementRef<HTMLElement>;
  @ViewChild('myTabAO') myTabAO!: ElementRef<HTMLElement>;

  @ViewChild('aportesObligatotios') aportesObligatotios!: ElementRef<HTMLElement>;
  @ViewChild('aportesAdicionales') aportesAdicionales!: ElementRef<HTMLElement>;

  aportanteSvc = inject(AportanteService);

  constructor(
  ) { }



  ngOnInit(): void {

    // Cuando se active el componete de pago facil, eliminar la linea de abajo
    this.router.navigateByUrl(CoreConstants.Rutas.login);

    // Cuando se active el componete de pago facil, descomentar las lineas de abajo

    // this.cargarImagenes();
    
    // if (this.authSvc.isAuthenticate()) {
    //   this.tiposDocumentoIdentidad = this.catalogoSvc.getTiposDocumentosidentidadFromStorage();
    //   this.selecionarMenuItem(CoreConstants.Rutas.pagoFacil)
    // }
    // else {
    //   this.router.navigateByUrl(CoreConstants.Rutas.login);
    // }
  }
  ngAfterViewInit(): void {
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
  }

  verAportesObligatorios(): boolean {

    //this.limpiar();
    if (Number.parseInt(this.idTipoDocumento) > 0 && this.numeroDocumento.length > 0) {
      let aportesObligatotios: HTMLElement = this.aportesObligatotios.nativeElement;
      aportesObligatotios.className = 'tab-pane fade show active';

      let aportesAdicionales: HTMLElement = this.aportesAdicionales.nativeElement;
      aportesAdicionales.className = 'tab-pane fade';

      let el: HTMLElement = this.myTabAA.nativeElement;
      el.className = 'nav-link';

      let el2: HTMLElement = this.myTabAO.nativeElement;
      el2.className = 'nav-link active';

      this.getPeriodoPago(this.valorAporteObligatorio);
    }
    return true
  }


  getPeriodoPago(tipoAporte: string) {
    //debugger;
    this.tipoAporteSeleccionado = tipoAporte;

    this.aportanteSvc.getPeriodoPago(this.idTipoDocumento, this.numeroDocumento, tipoAporte, String(this.numeroPagina), String(this.itemsPorPagina))
      .subscribe(
        {
          next: (res: any) => {
            //debugger;
            let resultado = this.evaluarRespuesta(res);
            if (resultado.exito) {
              this.consultaExitosa = true;
              if (res.Result.numTotalPeriodos > 0) {
                let resultado = res.Result as PeriodoPagoResponse;
                this.listaAportes = resultado.listaPeriodoAporte.filter(x => x.saldoAporte >= 0); //Solo registros que tengan saldo mayor a 0
                this.afiliadoFacultativo = resultado.afiliadoFacultativo;
                this.totalRegistros = res.Result.numTotalPeriodos;

                if (this.totalRegistros > 0) {
                  switch (tipoAporte) {
                    case CoreConstants.General.aportesFacultativosObligatorios: {
                      this.listaAportesObligatorioMostrar = this.listaAportes.slice(0, this.itemsPorPagina);
                      this.listaAportesObligatorioMostrar.forEach(re => {
                        re.indTipoPeri = CoreConstants.General.aportesFacultativosObligatorios;
                      });
                      break;
                    }
                    case CoreConstants.General.aportesFacultativosAdicionales: {
                      this.listaAportesAdicionalesMostrar = this.listaAportes.slice(0, this.itemsPorPagina);
                      this.listaAportesAdicionalesMostrar.forEach(re => {
                        re.indTipoPeri = CoreConstants.General.aportesFacultativosAdicionales
                      });
                      break;
                    }
                  }

                  this.listaAportesObligatorioMostrar.forEach(re => {
                    re.checked = re.indEstadoPago == CoreConstants.General.estadoPrePago ? true : false;
                  });

                  this.listaAportesAdicionalesMostrar.forEach(re => {
                    re.checked = re.indEstadoPago == CoreConstants.General.estadoPrePago ? true : false;
                  });

                  this.nombreAfiliado = resultado.afiliadoFacultativo.nombres + " " + resultado.afiliadoFacultativo.apellidoPaterno + " " + resultado.afiliadoFacultativo.apellidoMaterno;
                }

                if (this.listaAportesObligaSelecionados.length > 0) {
                  this.listaAportesObligatorioMostrar.forEach(obj => {
                    this.listaAportesObligaSelecionados.forEach(obj2 => {
                      if (obj.periodoAportacion == obj2.periodoAportacion) {
                        obj.checked = true;
                        obj.montoPagoDecla = obj2.montoPagoDecla;
                      }
                    });
                  });
                }

                if (this.listaAportesAdicionalesSelecionados.length > 0) {
                  this.listaAportesAdicionalesMostrar.forEach(obj => {
                    this.listaAportesAdicionalesSelecionados.forEach(obj2 => {
                      if (obj.periodoAportacion == obj2.periodoAportacion) {
                        obj.checked = true;
                        obj.montoPagoDecla = obj2.montoPagoDecla;
                      }
                    });
                  });
                }

              } else {
                this.totalRegistros = 0;
              }
            }
          },
          error: (err: any) => {
            this.warning = `<p class='alert__info'>${err}</p>`;
          }
        });
  }

  verAportesAdicionales(): boolean {
    this.limpiar();
    if (Number.parseInt(this.idTipoDocumento) && this.numeroDocumento.length > 0) {
      let aportesObligatotios: HTMLElement = this.aportesObligatotios.nativeElement;
      aportesObligatotios.className = 'tab-pane fade';

      let aportesAdicionales: HTMLElement = this.aportesAdicionales.nativeElement;
      aportesAdicionales.className = 'tab-pane fade show active';

      let el: HTMLElement = this.myTabAA.nativeElement;
      el.className = 'nav-link active';

      let el2: HTMLElement = this.myTabAO.nativeElement;
      el2.className = 'nav-link';

      this.getPeriodoPago(this.valorAporteAdicional);
    }
    return true
  }

  limpiar(idTipoDoc: string = "0") {
    this.warning = "";
    this.listaAportesObligatorioMostrar = [];
    this.listaAportesAdicionalesMostrar = [];
    this.nombreAfiliado = "";
    this.idTipoDocumento = idTipoDoc;
    this.consultaExitosa = false;
    this.numeroDocumento = "";
  }

  siguiente() {
    this.verAportesAdicionales();
  }

  retornar() {
    this.verAportesObligatorios();
  }

  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.numeroPagina = event.page;

    this.listaAportesObligatorioMostrar = this.listaAportes.slice(startItem, endItem);
    this.getPeriodoPago(this.tipoAporteSeleccionado)
  }

  cargarImagenes() {
    this.imagenPDF = "~/../assets/images/icon-pdf.svg";
    this.imagenPageAfter = "~/../assets/images/pagination/icon-after.svg";
    this.imagenPageNext = "~/../assets/images/pagination/icon-next.svg";
    this.imagenPageFin = "~/../assets/images/pagination/icon-fin.svg";
    this.imagenPageIni = "~/../assets/images/pagination/icon-ini.svg";
    this.imagenAportes = "~/../assets/images/icon-user.svg";
  }

  tipoDocSelectChange(): void {
    //console.log(event)
    //debugger;
    if (Number.parseInt(this.idTipoDocumento) == 0) {
      this.limpiar("0");
    }
    else{
        this.warning="";
    }
  }

  evaluarRespuesta(res: any) {
    this.warning = "";
    let data = {
      exito: false,
      resultado: null
    }
    if (res.IsSuccess == true) {
      switch (res.Codigo) {
        case CoreConstants.CodigoRespuesta.OperacionExitosa:
          data.exito = true;
          data.resultado = res.Result; break;
        case CoreConstants.CodigoRespuesta.OperacionNoEjecutada:
          this.warning = res.Message; break;
        case CoreConstants.CodigoRespuesta.ErrorNoControlado:
          this.warning = CoreConstants.Mensajes.NoHayConexion; break;
        case CoreConstants.CodigoRespuesta.OperacionIncorrectaDatos:
          this.warning = res.Message; break;
        case CoreConstants.CodigoRespuesta.NoAutorizado:
          this.warning = res.Message; break;
        case CoreConstants.CodigoRespuesta.CambioClave:
          this.warning = res.Message; break;
      }
    } else {
      this.warning = res.Message;
    }
    return data;
  }
}
