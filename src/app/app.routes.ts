import { Routes } from '@angular/router';
import { DefaultErrorComponent } from './errors/components/default-error/default-error.component';
import LoginComponent from './auth/components/login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        component: LoginComponent, pathMatch: 'full',
    },
    {
        path: 'features',
        loadChildren: () => import('./features/features.routes').then(m => m.FEATURES_ROUTES),
    },  
    { path: '**', component: DefaultErrorComponent},
];
