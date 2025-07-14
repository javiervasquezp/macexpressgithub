import { Routes } from '@angular/router';
import { authGuard } from '@core/guard/auth.guard';
import { DefaultErrorComponent } from 'app/errors/components/default-error/default-error.component';

export const APORTANTES_ROUTES: Routes = [
    
    //la ruta comentada es para pago facil, se debe descomentar para activar la opción
    // {
    //     path: 'pago-facil-viewer',
    //     component: PagoFacilViewerComponent, 
    //     pathMatch:'full',
    //     canActivate: [authGuard]
    // },
    {
        path: 'reporte-aportes-acreditados',
        loadComponent: () => import('./components/reporte-aportes-acreditados/reporte-aportes-acreditados.component')
                                .then(c => c.ReporteAportesAcreditadosComponent),
        canActivate: [authGuard]
    },
    { path: '**', component: DefaultErrorComponent},
];

export default APORTANTES_ROUTES;