import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { NewsFilter, NewsOrderBy } from 'src/dto/filters/news.filter';
import { CreateNewsDto, UpdateNewsDto } from 'src/dto/news.dto';
import { News } from 'src/entities/news.entity';
import { parseDateToString } from 'src/utils/parseDateToString';
import { Between, ILike, Repository } from 'typeorm';

@Injectable()
export class NewsService {

  @InjectRepository(News)
  private readonly _newsRepository: Repository<News>;

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this._newsRepository.create({
      ...createNewsDto,
      published_at: parseDateToString(createNewsDto.published_at!),
    });
    return this._newsRepository.save(news);
  }

  async findAll(newsFilter: NewsFilter) {
    const { page = 1, limit = 10 } = newsFilter;
    const skip = (page - 1) * limit;

    let orderField = 'created_at';
    if (newsFilter.orderBy) {
      const validFields = Object.values(NewsOrderBy);
      if (validFields.includes(newsFilter.orderBy)) {
        orderField = newsFilter.orderBy;
      }
    }

    const order = {
      [orderField]: newsFilter.direction ? newsFilter.direction : 'desc',
    };

    const [news, total] = await this._newsRepository.findAndCount({
      skip,
      take: limit,
      where: {
        title: newsFilter.title ? ILike(`%${newsFilter.title}%`) : undefined,
        created_at: this._buildDateRange(newsFilter.createdAt),
        updated_at: this._buildDateRange(newsFilter.updatedAt),
        published_at: this._buildDateRange(newsFilter.publishedAt),
      },
      order
    });

    return {
      data: news.map(n => ({
        ...n,
        updated_at: parseDateToString(n.updated_at),
        created_at: parseDateToString(n.created_at),
        published_at: parseDateToString(n.published_at),
      })),
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
      updateData.published_at = parseDateToString(updateNewsDto.published_at);
    }

    Object.assign(news, updateData);
    return this._newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    await this._newsRepository.remove(news);
  }

  private _buildDateRange(date?: Date | string) {
    if (!date) return undefined;

    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    return Between(start, end);
  }
}
