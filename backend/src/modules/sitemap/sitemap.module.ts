import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../../entities/news.entity';
import { Project } from '../../entities/project.entity';
import { SitemapController } from './sitemap.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [TypeOrmModule.forFeature([News, Project])],
  controllers: [SitemapController],
  providers: [SitemapService],
})
export class SitemapModule {}
