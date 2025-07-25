
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '../entities/news.entity';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news.dto';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create({
      ...createNewsDto,
      dataPublicacao: new Date(createNewsDto.dataPublicacao),
    });
    return this.newsRepository.save(news);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [news, total] = await this.newsRepository.findAndCount({
      skip,
      take: limit,
      order: { dataPublicacao: 'DESC' },
    });

    return {
      data: news,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`Notícia com ID ${id} não encontrada`);
    }
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    const updateData: any = { ...updateNewsDto };
    
    if (updateNewsDto.dataPublicacao) {
      updateData.dataPublicacao = new Date(updateNewsDto.dataPublicacao);
    }
    
    Object.assign(news, updateData);
    return this.newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepository.remove(news);
  }
}
