import { Controller, Get, Header, Inject } from '@nestjs/common';
import { SitemapService } from './sitemap.service';

@Controller('api/v1/sitemap.xml')
export class SitemapController {
  @Inject(SitemapService)
  private readonly _sitemapService: SitemapService;

  @Get()
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  getSitemap(): Promise<string> {
    return this._sitemapService.build();
  }
}
