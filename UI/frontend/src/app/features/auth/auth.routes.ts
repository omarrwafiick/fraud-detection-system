import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.page').then(m => m.AuthPage),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { 
        path: 'login', 
        title: 'Login Page', 
        loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage) 
      },
      { 
        path: 'signup', 
        title: 'Signup Page', 
        loadComponent: () => import('./pages/signup/signup.page').then(m => m.SignupPage) 
      },
      { 
        path: 'login', 
        title: 'Login Page', 
        loadComponent: () => import('./pages/api-key/api-key.page').then(m => m.ApiKeyPage) 
      },
    ]
  }
];