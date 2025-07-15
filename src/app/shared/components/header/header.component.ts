import { Component, Input, OnInit, inject } from '@angular/core';
import { CoreConstants } from '@core/constants/core.constant';
import { environment } from '@envs/environment.development';
import { UserService } from '@services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';
import { Router } from '@angular/router';
import { MySignalsService } from '@shared/services/my-signals.service';

@Component({
    selector: 'app-header',
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{

  private readonly authService = inject(UserService);
  private readonly modalService = inject(BsModalService);
  private readonly router = inject(Router);  
  readonly mySignalsSvc = inject(MySignalsService);

  urlTeAsesoramos = environment.urlTeAsesoramos;

  navigationId: string | null = "";
  @Input() nombreUsuario: string = "";
  bsModalRef: BsModalRef | null = null;
  // mostrarMenu = this.mySignalsSvc.getMostrarMenuMovil();
  coreConstant = CoreConstants;
  
constructor() { }

  ngOnInit(): void {

    const user = this.authService.getLoggedUsers(CoreConstants.LocalStorage.Token);
    this.nombreUsuario=user.Nombre!;
  }

  addModalProcessClick(): void { 
    this.bsModalRef = this.modalService.show(ModalComponent, {class: 'modal-lg'});
    (<ModalComponent>this.bsModalRef!.content).onClose!.subscribe(result => {
      if (result) {
       // this.ngOnChanges();
       console.log('addModalProcessClick');
      }
      this.bsModalRef!.hide();
    });
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  mostrarMenuMovil(){
    // console.log("mostrarMenuMovil()");
    // console.log(this.mySignalsSvc.getMostrarMenuMovil());
    this.mySignalsSvc.updateMostrarMenuMovil(this.mySignalsSvc.getMostrarMenuMovil() ? false : true);
  }

  navigateTo(url : string){
    this.mySignalsSvc.updateMostrarMenuMovil(false);
    this.router.navigateByUrl(url);
  }
}
