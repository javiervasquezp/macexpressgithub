import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth.guard';
import { DefaultErrorComponent } from 'app/errors/components/default-error/default-error.component';

export const PENSIONISTA_ROUTES: Routes = [
    {
        path: 'boletas-pago',
        loadComponent: () => import('./components/boletas-pago/boletas-pago.component')
                                .then(c => c.BoletasPagoComponent),
        canActivate: [authGuard]
    },
    {
        path: 'resoluciones',
        loadComponent: () => import('./components/resoluciones/resoluciones.component')
                                .then(c => c.ResolucionesComponent),
        canActivate: [authGuard]
    },  
    { path: '**', component: DefaultErrorComponent},
];

export default PENSIONISTA_ROUTES;