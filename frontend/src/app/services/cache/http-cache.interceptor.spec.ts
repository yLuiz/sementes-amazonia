import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CACHE_TTL_MS, httpCacheInterceptor } from './http-cache.interceptor';

describe('httpCacheInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  const read = (url: string) => {
    const received: unknown[] = [];
    http.get(url).subscribe((body) => received.push(body));
    return received;
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpCacheInterceptor])), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 10, 5));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    controller.verify();
  });

  it('a segunda leitura igual não vai à rede', () => {
    read('/api/v1/news?page=1');
    controller.expectOne('/api/v1/news?page=1').flush({ id: 1 });

    expect(read('/api/v1/news?page=1')).toEqual([{ id: 1 }]);
    controller.expectNone('/api/v1/news?page=1');
  });

  it('parâmetros diferentes são leituras diferentes', () => {
    read('/api/v1/projects?page=1');
    controller.expectOne('/api/v1/projects?page=1').flush({ id: 1 });

    read('/api/v1/projects?page=2');
    controller.expectOne('/api/v1/projects?page=2').flush({ id: 2 });
  });

  it('expira depois de 60 segundos', () => {
    read('/api/v1/news/1');
    controller.expectOne('/api/v1/news/1').flush({ id: 1 });

    jasmine.clock().tick(CACHE_TTL_MS - 1);
    expect(read('/api/v1/news/1')).toEqual([{ id: 1 }]);

    jasmine.clock().tick(1);
    read('/api/v1/news/1');
    controller.expectOne('/api/v1/news/1').flush({ id: 1, novo: true });
  });

  ['post', 'put', 'delete'].forEach((method) => {
    it(`${method.toUpperCase()} bem-sucedido limpa tudo`, () => {
      read('/api/v1/news/1');
      read('/api/v1/projects/2');
      controller.expectOne('/api/v1/news/1').flush({ id: 1 });
      controller.expectOne('/api/v1/projects/2').flush({ id: 2 });

      http.request(method, '/api/v1/news/1', { body: {} }).subscribe();
      controller.expectOne('/api/v1/news/1').flush({});

      read('/api/v1/news/1');
      read('/api/v1/projects/2');
      controller.expectOne('/api/v1/news/1').flush({ id: 1, novo: true });
      controller.expectOne('/api/v1/projects/2').flush({ id: 2, novo: true });
    });
  });

  it('escrita que falhou mantém o que estava guardado', () => {
    read('/api/v1/news/1');
    controller.expectOne('/api/v1/news/1').flush({ id: 1 });

    http.put('/api/v1/news/1', {}).subscribe({ error: () => undefined });
    controller.expectOne('/api/v1/news/1').flush(null, { status: 500, statusText: 'Erro' });

    expect(read('/api/v1/news/1')).toEqual([{ id: 1 }]);
    controller.expectNone('/api/v1/news/1');
  });

  it('leitura que terminou depois de uma escrita não volta a guardar o dado velho', () => {
    read('/api/v1/news/1');
    const slowRead = controller.expectOne('/api/v1/news/1');

    http.put('/api/v1/news/1', {}).subscribe();
    controller.expectOne((req) => req.method === 'PUT').flush({});
    slowRead.flush({ id: 1, velho: true });

    read('/api/v1/news/1');
    controller.expectOne('/api/v1/news/1').flush({ id: 1, novo: true });
  });

  it('erro não entra no cache: tentar de novo vai à rede', () => {
    http.get('/api/v1/news').subscribe({ error: () => undefined });
    controller.expectOne('/api/v1/news').flush(null, { status: 500, statusText: 'Erro' });

    read('/api/v1/news');
    controller.expectOne('/api/v1/news').flush({ data: [] });
  });

  it('/auth e /health nunca entram no cache', () => {
    ['/api/v1/auth/me', '/health', '/api/v1/health'].forEach((url) => {
      read(url);
      controller.expectOne(url).flush({ ok: true });
      read(url);
      controller.expectOne(url).flush({ ok: true });
    });
  });

  it('endereços que só começam parecido não entram no cache', () => {
    read('/api/v1/newsletter');
    controller.expectOne('/api/v1/newsletter').flush({});
    read('/api/v1/newsletter');
    controller.expectOne('/api/v1/newsletter').flush({});
  });

  it('entrega cada resposta guardada mais de uma vez sem depender da rede', () => {
    read('/api/v1/news');
    controller.expectOne('/api/v1/news').flush({ data: [1] });

    expect(read('/api/v1/news')).toEqual([{ data: [1] }]);
    expect(read('/api/v1/news')).toEqual([{ data: [1] }]);
    controller.expectNone('/api/v1/news');
  });
});
