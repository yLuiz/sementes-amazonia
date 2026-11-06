import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_URL, SeoService, clipDescription, shareImageUrl } from './seo.service';

describe('SeoService', () => {
  let seo: SeoService;
  let meta: Meta;
  let head: HTMLHeadElement;

  const content = (selector: string) => meta.getTag(selector)?.content;
  const canonical = () => head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  beforeEach(() => {
    TestBed.configureTestingModule({});
    seo = TestBed.inject(SeoService);
    meta = TestBed.inject(Meta);
    head = TestBed.inject(DOCUMENT).head;
  });

  afterEach(() => {
    canonical()?.remove();
    meta.removeTag("name='robots'");
  });

  it('applies the page data to the title, tags and canonical link', () => {
    seo.update({ title: 'Notícia | Site', description: 'Resumo', path: '/article/5?type=news', image: 'foto.webp', type: 'article' });

    expect(TestBed.inject(Title).getTitle()).toBe('Notícia | Site');
    expect(content("name='description'")).toBe('Resumo');
    expect(content("property='og:title'")).toBe('Notícia | Site');
    expect(content("property='og:type'")).toBe('article');
    expect(content("property='og:url'")).toBe(`${SITE_URL}/article/5?type=news`);
    expect(content("property='og:image'")).toBe(`${SITE_URL}/api/v1/media/foto.webp?w=1280`);
    expect(canonical()?.href).toBe(`${SITE_URL}/article/5?type=news`);
    expect(meta.getTag("name='robots'")).toBeNull();
  });

  it('keeps a single canonical link across navigations', () => {
    seo.update({ path: '/a' });
    seo.update({ path: '/b' });

    expect(head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    expect(canonical()?.href).toBe(`${SITE_URL}/b`);
  });

  it('marks pages without a canonical path as noindex and clears what the previous page set', () => {
    seo.update({ path: '/a' });
    seo.update({ title: 'Painel' });

    expect(content("name='robots'")).toBe('noindex');
    expect(canonical()).toBeNull();
    expect(meta.getTag("property='og:url'")).toBeNull();
  });

  it('allows indexing again after a noindex page', () => {
    seo.update({ title: 'Painel' });
    seo.update({ path: '/' });

    expect(meta.getTag("name='robots'")).toBeNull();
  });
});

describe('clipDescription', () => {
  it('keeps short text and normalizes whitespace', () => {
    expect(clipDescription('  um\n texto   curto ')).toBe('um texto curto');
  });

  it('cuts long text on a word boundary, within the limit', () => {
    const result = clipDescription('palavra, '.repeat(40));

    expect(result.length).toBeLessThanOrEqual(160);
    expect(result).toMatch(/palavra…$/);
  });
});

describe('shareImageUrl', () => {
  it('falls back to the site image', () => {
    expect(shareImageUrl(null)).toBe(`${SITE_URL}/assets/og-image.jpg`);
    expect(shareImageUrl('')).toBe(`${SITE_URL}/assets/og-image.jpg`);
  });

  it('keeps external and local images without asking for a variant', () => {
    expect(shareImageUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg');
    expect(shareImageUrl('assets/photos/a.webp')).toBe(`${SITE_URL}/assets/photos/a.webp`);
  });
});
