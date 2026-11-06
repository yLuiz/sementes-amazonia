import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { News } from '../../entities/news.entity';
import { Project } from '../../entities/project.entity';
import { SitemapService, renderSitemap } from './sitemap.service';

describe('renderSitemap', () => {
  it('writes a valid url set with the official domain', () => {
    const xml = renderSitemap([{ path: '/' }]);

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<loc>https://sementes-amazonia.org/</loc>');
  });

  it('adds lastmod only when the date is valid', () => {
    const xml = renderSitemap([
      { path: '/a', lastModified: new Date('2026-11-05T12:00:00Z') },
      { path: '/b', lastModified: 'not a date' },
    ]);

    expect(xml).toContain(
      '<loc>https://sementes-amazonia.org/a</loc><lastmod>2026-11-05</lastmod>',
    );
    expect(xml).toContain(
      '<url><loc>https://sementes-amazonia.org/b</loc></url>',
    );
  });
});

describe('SitemapService', () => {
  it('lists the fixed pages, news and projects, each with its own type', async () => {
    const updated_at = new Date('2026-11-05T12:00:00Z');
    const module = await Test.createTestingModule({
      providers: [
        SitemapService,
        {
          provide: getRepositoryToken(News),
          useValue: { find: () => Promise.resolve([{ id: 7, updated_at }]) },
        },
        {
          provide: getRepositoryToken(Project),
          useValue: { find: () => Promise.resolve([{ id: 7, updated_at }]) },
        },
      ],
    }).compile();

    const xml = await module.get(SitemapService).build();

    expect(xml).toContain('/list-all?type=projects</loc>');
    expect(xml).toContain('/article/7?type=news</loc>');
    expect(xml).toContain('/article/7?type=project</loc>');
  });
});
