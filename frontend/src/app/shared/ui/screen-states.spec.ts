import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { of } from 'rxjs';
import { ContentListComponent } from '../../admin/content-list/content-list.component';
import { ArticleComponent } from '../../blog/components/article/article.component';
import { FeaturedProjectComponent } from '../../blog/components/featured-project/featured-project.component';
import { ListAllComponent } from '../../blog/components/list-all/list-all.component';
import { NewsComponent } from '../../blog/components/news/news.component';
import { ProjectsComponent } from '../../blog/components/projects/projects.component';
import { httpCacheInterceptor } from '../../services/cache/http-cache.interceptor';

// Com OnPush, a tela só muda se o componente pedir. Estes testes olham o DOM depois
// de cada resposta para pegar uma tela que ficou parada, presa no estado anterior.
describe('estados das telas', () => {
  let fixture: ComponentFixture<unknown>;
  let controller: HttpTestingController;

  const NEWS_LIST = '/api/v1/news?page=1&limit=3&direction=desc&orderBy=id';
  const PROJECTS_LIST = '/api/v1/projects?page=1&limit=3&direction=desc&orderBy=id';
  const item = { id: 1, title: 'Item carregado', summary: 'Resumo', image_thumb: null, published_at: '2026-11-05', content: 'Texto', tags: '' };
  const page = (data: unknown[]) => ({ data, meta: { total: data.length } });
  const serverError = { status: 500, statusText: 'Erro' };

  const element = () => fixture.nativeElement as HTMLElement;
  const text = () => element().textContent ?? '';
  const retry = () => element().querySelector<HTMLButtonElement>('app-empty-state button')!;

  const setup = (component: Type<unknown>, route: object = {}) => {
    TestBed.configureTestingModule({
      imports: [component],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpCacheInterceptor])),
        provideHttpClientTesting(),
        provideToastr(),
        provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: route },
      ],
    });
    controller = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(component);
    fixture.detectChanges();
  };

  const expectFullCycle = (url: string, errorTitle: string, emptyTitle: string) => {
    expect(element().querySelector('.skeleton')).withContext('carregando').not.toBeNull();

    controller.expectOne(url).flush(null, serverError);
    fixture.detectChanges();
    expect(text()).withContext('erro').toContain(errorTitle);
    expect(element().querySelector('.skeleton')).withContext('saiu do carregando').toBeNull();

    retry().click();
    fixture.detectChanges();
    expect(element().querySelector('.skeleton')).withContext('tentando de novo').not.toBeNull();

    controller.expectOne(url).flush(page([]));
    fixture.detectChanges();
    expect(text()).withContext('vazio').toContain(emptyTitle);
  };

  afterEach(() => controller.verify());

  it('notícias da home: carregando, erro, tentar de novo e vazio', () => {
    setup(NewsComponent);
    expectFullCycle(NEWS_LIST, 'Não foi possível carregar as notícias', 'Nenhuma notícia publicada');
  });

  it('notícias da home mostram os cards', () => {
    setup(NewsComponent);
    controller.expectOne(NEWS_LIST).flush(page([item]));
    fixture.detectChanges();
    expect(element().querySelectorAll('app-content-card').length).toBe(1);
    expect(text()).toContain('Ver todas as notícias');
  });

  it('projetos da home: carregando, erro, tentar de novo e vazio', () => {
    setup(ProjectsComponent);
    expectFullCycle(PROJECTS_LIST, 'Não foi possível carregar os projetos', 'Nenhum projeto publicado');
  });

  ['404', '500'].forEach((status) => {
    it(`destaque com ${status} some sem aviso`, () => {
      setup(FeaturedProjectComponent);
      controller.expectOne('/api/v1/projects/featured').flush(null, { status: Number(status), statusText: 'Erro' });
      fixture.detectChanges();
      expect(text().trim()).toBe('');
    });
  });

  it('destaque aparece quando a API responde', () => {
    setup(FeaturedProjectComponent);
    controller.expectOne('/api/v1/projects/featured').flush({ ...item, is_featured: true });
    fixture.detectChanges();
    expect(text()).toContain('Item carregado');
  });

  describe('lista pública', () => {
    const URL = '/api/v1/news?page=1&limit=12&direction=desc&orderBy=id';
    const route = { queryParams: of({ type: 'news' }) };

    it('carregando, erro, tentar de novo e vazio', () => {
      setup(ListAllComponent, route);
      expectFullCycle(URL, 'Não foi possível carregar as notícias', 'Nenhum resultado encontrado');
    });

    it('mostra os cards', () => {
      setup(ListAllComponent, route);
      controller.expectOne(URL).flush(page([item]));
      fixture.detectChanges();
      expect(element().querySelectorAll('app-content-card').length).toBe(1);
    });
  });

  describe('artigo', () => {
    const route = (id: string) => ({
      snapshot: { paramMap: convertToParamMap({ id }) },
      queryParamMap: of(convertToParamMap({ type: 'news' })),
    });

    it('falha da API mostra aviso, e tentar de novo carrega', () => {
      setup(ArticleComponent, route('1'));
      expect(element().querySelector('.skeleton')).not.toBeNull();

      controller.expectOne('/api/v1/news/1').flush(null, serverError);
      fixture.detectChanges();
      expect(text()).toContain('Não foi possível carregar o conteúdo');

      retry().click();
      fixture.detectChanges();
      controller.expectOne('/api/v1/news/1').flush(item);
      fixture.detectChanges();
      expect(element().querySelector('h1')?.textContent).toContain('Item carregado');
    });

    it('404 é "não encontrado", e a API fora do ar não é', () => {
      setup(ArticleComponent, route('1'));
      controller.expectOne('/api/v1/news/1').flush(null, { status: 404, statusText: 'Not Found' });
      fixture.detectChanges();
      expect(text()).toContain('Conteúdo não encontrado');
      expect(text()).not.toContain('Tentar novamente');
    });

    it('id que não é número não chama a API', () => {
      setup(ArticleComponent, route('abc'));
      fixture.detectChanges();
      expect(text()).toContain('Conteúdo não encontrado');
    });
  });

  describe('lista do painel', () => {
    const route = (type: 'news' | 'project') => ({ snapshot: { data: { type } } });

    it('falha mostra aviso sem contagem, e tentar de novo carrega', () => {
      setup(ContentListComponent, route('project'));
      expect(element().querySelector('.panel__count')).withContext('não diz "0 registros" antes da resposta').toBeNull();

      controller.expectOne((req) => req.url === '/api/v1/projects').flush(null, serverError);
      fixture.detectChanges();

      expect(text()).toContain('Não foi possível carregar os projetos');
      expect(element().querySelector('.panel__count')).toBeNull();

      retry().click();
      fixture.detectChanges();
      controller.expectOne((req) => req.url === '/api/v1/projects').flush(page([]));
      fixture.detectChanges();
      expect(text()).toContain('Nenhum projeto publicado');
      expect(text()).toContain('0 registros');
    });

    it('indica o projeto em destaque, e só ele', () => {
      setup(ContentListComponent, route('project'));
      controller
        .expectOne((req) => req.url === '/api/v1/projects')
        .flush(page([{ ...item, is_featured: true }, { ...item, id: 2, title: 'Outro', is_featured: false }]));
      fixture.detectChanges();

      const badges = element().querySelectorAll('tbody app-badge');
      expect(badges.length).toBe(1);
      expect(badges[0].textContent).toContain('Em destaque');
      expect(badges[0].closest('tr')?.textContent).toContain('Item carregado');
    });

    it('notícias não mostram a indicação', () => {
      setup(ContentListComponent, route('news'));
      controller.expectOne((req) => req.url === '/api/v1/news').flush(page([{ ...item, is_featured: true }]));
      fixture.detectChanges();
      expect(element().querySelector('tbody app-badge')).toBeNull();
    });
  });
});
