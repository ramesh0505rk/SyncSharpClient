import { Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./work-list/work-list.component').then(m => m.WorkListComponent)
            },
            {
                path: 'work-list',
                loadComponent: () => import('./work-list/work-list.component').then(m => m.WorkListComponent)
            }
        ]
    },
    { path: 'signin', component: SignInComponent },
    { path: 'signup', component: SignUpComponent }
];
