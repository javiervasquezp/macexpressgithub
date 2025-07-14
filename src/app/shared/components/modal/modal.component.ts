import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { UserService } from '@services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit{

  bsModalRef = inject(BsModalRef);
  private readonly route = inject(Router);
  private readonly userService = inject(UserService);
  @Input() titulo: string = "";
  @Input() body: string = "";
  @Input() esModalConfirmar: boolean = false;
  indicadorSi:boolean = false;

  public onClose!: Subject<boolean>;

  constructor() { }

  ngOnInit(): void {
    this.onClose = new Subject(); 
  }

  CerrarSesionClick(){  
    this.userService.setLogOut();          
    this.route.navigateByUrl(CoreConstants.Rutas.login);
    this.cancelarClick();
  }

  cancelarClick(){
    this.onClose.next(false);
    this.bsModalRef.hide();
  }
}
