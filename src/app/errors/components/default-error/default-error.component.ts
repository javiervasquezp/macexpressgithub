import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CoreConstants } from '@core/constants/core.constant';

@Component({
  selector: 'app-default-error',
  standalone: true,
  imports: [],
  templateUrl: './default-error.component.html',
  styleUrl: './default-error.component.css'
})
export class DefaultErrorComponent {

  private readonly router = inject(Router);
  goToLogin(){
    this.router.navigateByUrl(CoreConstants.Rutas.login);
  }
}
