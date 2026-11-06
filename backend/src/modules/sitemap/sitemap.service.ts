import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { News } from '../../entities/news.entity';
import { Project } from '../../entities/project.entity';
import { Repository } from 'typeorm';

// Os endereços do mapa são sempre os do domínio oficial, mesmo se ele for lido por outro endereço.
const SITE_URL = 'https://sementes-amazonia.org';
const STATIC_PATHS = [
  '/',
  '/about-us',
  '/list-all?type=news',
  '/list-all?type=projects',
];

interface SitemapEntry {
  path: string;
  lastModified?: string | Date;
}

const toLastModified = (value?: string | Date): string | null => {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime())
    ? date.toISOString().slice(0, 10)
    : null;
};

export function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map(({ path, lastModified }) => {
    const date = toLastModified(lastModified);
    return `  <url><loc>${SITE_URL}${path}</loc>${date ? `<lastmod>${date}</lastmod>` : ''}</url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

@Injectable()
export class SitemapService {
  @InjectRepository(News)
  private readonly _newsRepository: Repository<News>;

  @InjectRepository(Project)
  private readonly _projectRepository: Repository<Project>;

  async build(): Promise<string> {
    const query = {
      select: { id: true, updated_at: true },
      order: { id: 'ASC' as const },
    };
    const [news, projects] = await Promise.all([
      this._newsRepository.find(query),
      this._projectRepository.find(query),
    ]);

    return renderSitemap([
      ...STATIC_PATHS.map((path) => ({ path })),
      ...news.map((item) => ({
        path: `/article/${item.id}?type=news`,
        lastModified: item.updated_at,
      })),
      ...projects.map((item) => ({
        path: `/article/${item.id}?type=project`,
        lastModified: item.updated_at,
      })),
    ]);
  }
}
