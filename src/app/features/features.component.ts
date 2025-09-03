import { CommonModule } from '@angular/common';
import { Component, OnInit, inject} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { DetalleMenuModel, MenuModel, MenuPrincipalModel } from '@core/models/menu.models';
import { Usuario } from '@core/models/usuario.model';
import { UserService } from '@services/user.service';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { MenuStoreService } from '@shared/services/menu-store.service';


@Component({
    selector: 'app-features',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        CommonModule
    ],
    templateUrl: './features.component.html',
    styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit{  

  validation: boolean = false;
  ListaMenu: MenuPrincipalModel[] | [] = [];

  private readonly userSvc = inject(UserService);
  private readonly menuStoreSVC = inject(MenuStoreService);
  menus = this.menuStoreSVC.menus;
  isLoading = this.menuStoreSVC.isLoading;
  error = this.menuStoreSVC.error;
  private readonly router = inject(Router); 

  coreConstant = CoreConstants;

  usuario!: Usuario;

  ngOnInit(): void {
    //debugger;
    this.usuario = this.userSvc.getLoggedUsers(CoreConstants.LocalStorage.Token);
    console.log(" FeaturesComponent -- ngOnInit()");
    console.log(this.menus());
  }

  navigateTo(menuPrincipal: MenuPrincipalModel, detalle: DetalleMenuModel){
    if(detalle != undefined && detalle != null && detalle.Url != undefined && detalle.Url != null){
      if (detalle.IdServicio) 
        this.menuStoreSVC.toggleSeleccionDetalle(menuPrincipal.Id, detalle.IdServicio);
      
      this.router.navigateByUrl(detalle.Url);
    }
      
  }

  // navigateTo(url: string){
  //     this.router.navigateByUrl(url);
  // }


  // listaMenu() {
  //   try {
  //     this.validation = true;
  //     this.menuSvc.ListaMenu().subscribe(

  //       (res: any) => {

  //         if (res.Codigo == CoreConstants.CodigoRespuesta.OperacionExitosa) {
  //           this.ListaMenu = res.Result as MenuPrincipalModel[];
  //           this.ListaMenu.forEach((menu: MenuPrincipalModel, idxA : number) => {
  //             menu.ListaMenu.forEach((menuModel : MenuModel, idxB : number) => {
  //               menuModel.Detalle?.forEach(( detalle: DetalleMenuModel, idxC : number) => {
  //                 detalle.Seleccionado = (idxA == 0 && idxB == 0 && idxC == 0)
  //               });
  //             });
  //           });
  //           console.log(this.ListaMenu);
  //           this.validation = false;
  //           // this.setAplicationPerfil();
  //         }
  //         else {
  //           // if (res.Message != null && res.Message != "")
  //           //   this.titleSpinner = res.Message;
  //           // setTimeout(() => { this.userService.authlogon(); }, 10000);
  //         }
  //       });
  //   } catch (e) {
  //     this.validation = true;
  //     this.userSvc.authlogon();
  //   }
  // }
}
