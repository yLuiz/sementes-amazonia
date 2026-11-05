import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { notAuthGuard } from './guards/not-auth.guard';

const SITE_NAME = 'Sementes da Amazônia';

const contentRoutes = (path: string, type: 'news' | 'project', plural: string, singular: string): Routes => [
  {
    path,
    title: `${plural} | Painel`,
    data: { type },
    loadComponent: () => import('./admin/content-list/content-list.component').then((m) => m.ContentListComponent),
  },
  {
    path: `${path}/new`,
    title: `Novo cadastro de ${singular} | Painel`,
    data: { type },
    loadComponent: () => import('./admin/content-form/content-form.component').then((m) => m.ContentFormComponent),
  },
  {
    path: `${path}/:id/edit`,
    title: `Editar ${singular} | Painel`,
    data: { type },
    loadComponent: () => import('./admin/content-form/content-form.component').then((m) => m.ContentFormComponent),
  },
];

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: SITE_NAME,
    loadComponent: () => import('./blog/blog.component').then((m) => m.BlogComponent),
  },
  {
    path: 'list-all',
    title: `Notícias e projetos | ${SITE_NAME}`,
    loadComponent: () => import('./blog/components/list-all/list-all.component').then((m) => m.ListAllComponent),
  },
  {
    path: 'article/:id',
    title: SITE_NAME,
    loadComponent: () => import('./blog/components/article/article.component').then((m) => m.ArticleComponent),
  },
  {
    path: 'about-us',
    title: `Nossa história | ${SITE_NAME}`,
    loadComponent: () => import('./blog/components/about-us/about-us.component').then((m) => m.AboutUsComponent),
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        title: `Entrar | ${SITE_NAME}`,
        loadComponent: () => import('./admin/login/login.component').then((m) => m.LoginComponent),
        canActivate: [notAuthGuard],
      },
      {
        path: '',
        loadComponent: () => import('./admin/admin.component').then((m) => m.AdminComponent),
        canActivate: [authGuard],
        children: [
          ...contentRoutes('news', 'news', 'Notícias', 'notícia'),
          ...contentRoutes('projects', 'project', 'Projetos', 'projeto'),
          // Endereços antigos do painel.
          { path: 'registers', redirectTo: 'news/new', pathMatch: 'full' },
          { path: '**', redirectTo: 'news' },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
