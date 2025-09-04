import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { notAuthGuard } from './guards/not-auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./admin/login/login.component').then((m) => m.LoginComponent),
        canActivate: [notAuthGuard]
      },
      {
        path: 'registers',
        loadComponent: () =>
          import('./admin/registers/registers.component').then((m) => m.RegistersComponent),
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: 'list-all',
        loadComponent: () =>
          import('./admin/list-all/list-all.component').then((m) => m.ListAllComponent),
        canActivate: [authGuard],
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'login',
      }
    ],

  },
  {
    path: '**',
    redirectTo: ''
  }
];
