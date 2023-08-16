import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileRoutes),
  },
  {
    path: 'ranking',
    loadComponent: () => import('./ranking/ranking.component'),
  },
  {
    path: 'schedule',
    loadComponent: () => import('./schedule/schedule.component'),
  },
  {
    path: '**',
    redirectTo: 'profile',
    pathMatch: 'full',
  },
];
