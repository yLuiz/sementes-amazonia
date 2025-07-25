
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { News } from '../entities/news.entity';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  imports: [TypeOrmModule.forFeature([News])],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
