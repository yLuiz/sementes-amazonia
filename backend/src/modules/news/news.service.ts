import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { resolve } from 'path';
import envConfig from 'src/config/config';
import { NewsFilter, NewsOrderBy } from 'src/dto/filters/news.filter';
import { CreateNewsDto, UpdateNewsDto } from 'src/dto/news.dto';
import { News } from 'src/entities/news.entity';
import { parseDateToString } from 'src/utils/parseDateToString';
import { Between, ILike, Repository } from 'typeorm';

import * as fs from 'fs/promises';

// Use a mesma pasta dos uploads (volume ou local)
const BASE_DIR = envConfig().UPLOAD_DIR;

@Injectable()
export class NewsService {

  @InjectRepository(News)
  private readonly _newsRepository: Repository<News>;

  private readonly _logger = new Logger();

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

  private _safePath(filename: string) {
    const base = resolve(BASE_DIR);
    const full = resolve(base, filename);
    if (!full.startsWith(base)) {
      throw new BadRequestException('Caminho de arquivo inválido');
    }
    return full;
  }

  private async _deleteFileIfExists(filename?: string) {
    if (!filename) return;
    try {
      await fs.unlink(this._safePath(filename));
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        this._logger.warn(`Falha ao remover arquivo "${filename}": ${err?.message || err}`);
      }
    }
  }

  async update(id: number, updateNewsDto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    const oldImage = news.image_thumb;

    const updateData: any = { ...updateNewsDto };
    if (updateNewsDto.published_at) {
      updateData.published_at = parseDateToString(updateNewsDto.published_at);
    }

    Object.assign(news, updateData);
    const saved = await this._newsRepository.save(news);

    // Se veio uma nova imagem no DTO, remove a antiga (se diferente)
    if (
      updateNewsDto.image_thumb &&
      oldImage &&
      oldImage !== updateNewsDto.image_thumb
    ) {
      await this._deleteFileIfExists(oldImage);
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    const oldImage = news.image_thumb;

    await this._newsRepository.remove(news);
    await this._deleteFileIfExists(oldImage);
  }

  private _buildDateRange(date?: Date | string) {
    if (!date) return undefined;

    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    return Between(start, end);
  }
}
