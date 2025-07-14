import { Routes } from '@angular/router';
import { FeaturesComponent } from './features.component';
import { DefaultErrorComponent } from 'app/errors/components/default-error/default-error.component';

export const FEATURES_ROUTES: Routes = [
    
    {
        path:'', 
        component: FeaturesComponent,
        children: [
            {
                path: 'aportante',
                loadChildren: () => import('./aportante/aportante.routes').then(r => r.APORTANTES_ROUTES),
            },
            {
                path: 'pensionista',
                loadChildren: () => import('./pensionista/pensionista.routes').then(r => r.PENSIONISTA_ROUTES),
            }
        ]
    }
];

export default FEATURES_ROUTES;