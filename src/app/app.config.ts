import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { AuthJwtInterceptor } from '@core/interceptor/auth-jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { spinnerInterceptor } from '@core/interceptor/spinner.interceptor';
import { ModalModule } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([spinnerInterceptor,AuthJwtInterceptor])
    ),
    importProvidersFrom(ModalModule.forRoot(),NgxSpinnerModule.forRoot({ type: 'ball-clip-rotate' })),
    provideAnimations(), // required animations providers    
    provideToastr(), // Toastr providers
  ]
};
