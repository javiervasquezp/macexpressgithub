import { Component, OnInit, inject} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';
import { Usuario } from '@core/models/usuario.model';
import { UserService } from '@services/user.service';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';


@Component({
    selector: 'app-features',
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent
    ],
    templateUrl: './features.component.html',
    styleUrl: './features.component.css'
})
export class FeaturesComponent implements OnInit{  
  private readonly userSvc = inject(UserService);
  private readonly router = inject(Router);
  coreConstant = CoreConstants;

  usuario!: Usuario;

  ngOnInit(): void {
    //debugger;
    this.usuario = this.userSvc.getLoggedUsers(CoreConstants.LocalStorage.Token);
  }

  navigateTo(url : string){
    this.router.navigateByUrl(url);
  }
}
