import { Routes } from '@angular/router';

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
      },
      {
        path: 'registers',
        loadComponent: () =>
          import('./admin/registers/registers.component').then((m) => m.RegistersComponent),
      },
    ],
  },
];
