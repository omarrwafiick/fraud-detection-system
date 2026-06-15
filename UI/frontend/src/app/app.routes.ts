import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'landing', 
    pathMatch: 'full'
  },
  { 
    path: 'landing', 
    title: 'Welcome | Fraud Detection Platform',
    loadComponent: () => import('./features/landing/landing.page').then(m => m.LandingPage),
    canActivate: [guestGuard]
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  { 
    path: 'dashboard',
    children: [
      { 
        path: 'user', 
        loadChildren: () => import('./features/dashboard/user/dashboard.routes').then(m => m.DASHBOARD_USER_ROUTES)
      }
    ]
  },
  { 
    path: '**', 
    title: '404 - Page Not Found',
    loadComponent: () => import('./shared/pages/not-found/not-found.page').then(m => m.NotFoundPage) 
  }
];