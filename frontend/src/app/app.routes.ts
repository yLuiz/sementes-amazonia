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
    path: 'list-all',
    loadComponent: () =>
      import('./blog/components/list-all/list-all.component').then((m) => m.ListAllComponent),
  },
  {
    path: 'article/:id',
    loadComponent: () =>
      import('./blog/components/article/article.component').then((m) => m.ArticleComponent),
  },


  {
    path: 'admin',
    children: [
      // Sem layout
      {
        path: 'login',
        loadComponent: () => import('./admin/login/login.component').then(m => m.LoginComponent),
        canActivate: [notAuthGuard],
      },
      {
        path: '',
        loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
        canActivate: [authGuard],
        children: [
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
            path: 'edit/:id',
            loadComponent: () =>
              import('./admin/edit/edit.component').then((m) => m.EditComponent),
            canActivate: [authGuard],
            pathMatch: 'full',
          },
          {
            path: 'list-all',
            loadComponent: () =>
              import('./blog/components/list-all/list-all.component').then((m) => m.ListAllComponent),
            canActivate: [authGuard],
            pathMatch: 'full',
          },
          {
            path: '**',
            redirectTo: 'registers',
          }
        ],
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
