import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { Router, TitleStrategy, provideRouter } from '@angular/router';
import { SeoTitleStrategy } from './seo-title.strategy';

@Component({ standalone: true, template: '' })
class BlankComponent {}

describe('SeoTitleStrategy', () => {
  let router: Router;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'public', title: 'Pública', data: { seo: { description: 'Descrição pública', path: '/public' } }, component: BlankComponent },
          { path: 'private', title: 'Privada', component: BlankComponent },
          { path: 'managed', title: 'Ignorado', data: { seoManaged: true }, component: BlankComponent },
        ]),
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
      ],
    });
    router = TestBed.inject(Router);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  afterEach(() => {
    meta.removeTag("name='robots'");
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  it('applies the data of a public route', async () => {
    await router.navigateByUrl('/public');

    expect(title.getTitle()).toBe('Pública');
    expect(meta.getTag("name='description'")?.content).toBe('Descrição pública');
    expect(meta.getTag("name='robots'")).toBeNull();
  });

  it('does not index routes without SEO data', async () => {
    await router.navigateByUrl('/private');

    expect(title.getTitle()).toBe('Privada');
    expect(meta.getTag("name='robots'")?.content).toBe('noindex');
  });

  it('leaves routes managed by their component untouched', async () => {
    title.setTitle('Definido pelo componente');

    await router.navigateByUrl('/managed');

    expect(title.getTitle()).toBe('Definido pelo componente');
  });
});
