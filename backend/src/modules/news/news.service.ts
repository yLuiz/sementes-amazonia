
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNewsDto, UpdateNewsDto } from 'src/dto/news.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { News } from 'src/entities/news.entity';
import { Repository } from 'typeorm';


@Injectable()
export class NewsService {

  @InjectRepository(News)
  private readonly _newsRepository: Repository<News>;

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this._newsRepository.create({
      ...createNewsDto,
      published_at: new Date(createNewsDto.published_at),
    });
    return this._newsRepository.save(news);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [news, total] = await this._newsRepository.findAndCount({
      skip,
      take: limit,
      order: { published_at: 'DESC' },
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
    const news = await this._newsRepository.findOne({ where: { id } });
    if (!news) {
      throw new NotFoundException(`Notícia com ID ${id} não encontrada`);
    }
    return news;
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    const updateData: any = { ...updateNewsDto };

    if (updateNewsDto.published_at) {
      updateData.published_at = new Date(updateNewsDto.published_at);
    }

    Object.assign(news, updateData);
    return this._newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this._newsRepository.remove(news);
  }
}
