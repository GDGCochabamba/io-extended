import { Routes } from '@angular/router';

export const profileLoginRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile-login.component'),
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./sign-in/sign-in.component'),
      },
      {
        path: 'confirm-email',
        loadComponent: () => import('./confirm-email/confirm-email.component'),
      },
    ],
  },
];
