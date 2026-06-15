import { Routes } from '@angular/router';
import { guestGuard } from '../../core/guards/guest-guard';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './state/auth.reducer';
import { AuthEffects } from './state/auth.effects';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState({ name: 'authFeature', reducer: authReducer }),
      provideEffects(AuthEffects),
    ],
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
    ],
    canActivate: [guestGuard]
  }
];