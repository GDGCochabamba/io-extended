import { Routes } from '@angular/router';

import { authGuard } from '../core/guards/auth.guard';
import { loginGuard } from '../core/guards/login.guard';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component'),
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
      {
        path: 'details',
        loadComponent: () =>
          import('./profile-details/profile-details.component'),
        canActivate: [authGuard],
      },
      {
        path: 'login',
        loadChildren: () =>
          import('./profile-login/profile-login.routes').then(
            (m) => m.profileLoginRoutes,
          ),
        canActivate: [loginGuard],
      },
    ],
  },
];
