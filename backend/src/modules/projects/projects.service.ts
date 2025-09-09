
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ProjectsFilter, ProjectsOrderBy } from 'src/dto/filters/projects.filter';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import { Project } from 'src/entities/project.entity';
import { parseDateToString } from 'src/utils/parseDateToString';
import { Between, ILike, Repository } from 'typeorm';

import * as fs from 'fs/promises';
import envConfig from 'src/config/config';
import { resolve } from 'path';

// Use a mesma pasta dos uploads (volume ou local)
const BASE_DIR = envConfig().UPLOAD_DIR;

@Injectable()
export class ProjectsService {

  @InjectRepository(Project)
  private projectsRepository: Repository<Project>;

  private readonly _logger = new Logger();

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async findAll(projectsFilters: ProjectsFilter) {
    const { page = 1, limit = 10 } = projectsFilters;
    const skip = (page - 1) * limit;

    let orderField = 'created_at';
    if (projectsFilters.orderBy) {
      const validFields = Object.values(ProjectsOrderBy);
      if (validFields.includes(projectsFilters.orderBy)) {
        orderField = projectsFilters.orderBy;
      }
    }

    const order = {
      [orderField]: projectsFilters.direction ? projectsFilters.direction : 'desc',
    };

    const [projects, total] = await this.projectsRepository.findAndCount({
      skip,
      take: limit,
      where: {
        title: projectsFilters.title ? ILike(`%${projectsFilters.title}%`) : undefined,
        created_at: this._buildDateRange(projectsFilters.createdAt),
        updated_at: this._buildDateRange(projectsFilters.updatedAt),
      },
      order
    });

    return {
      data: projects.map(p => ({
        ...p,
        updated_at: parseDateToString(p.updated_at),
        created_at: parseDateToString(p.created_at),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findFeatured() {
    return await this.projectsRepository.findOne({
      where: { is_featured: true },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Projeto com ID ${id} não encontrado`);
    }
    return project;
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

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const oldImage = project.image_thumb;

    const updateData: any = { ...updateProjectDto };
    if (updateProjectDto.published_at) {
      updateData.published_at = parseDateToString(updateProjectDto.published_at);
    }

    Object.assign(project, updateData);
    const saved = await this.projectsRepository.save(project);

    // Se veio uma nova imagem no DTO, remove a antiga (se diferente)
    if (
      updateProjectDto.image_thumb &&
      oldImage &&
      oldImage !== updateProjectDto.image_thumb
    ) {
      await this._deleteFileIfExists(oldImage);
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const news = await this.findOne(id);
    const oldImage = news.image_thumb;

    await this.projectsRepository.remove(news);
    await this._deleteFileIfExists(oldImage);
  }


  private _buildDateRange(date?: Date | string) {
    if (!date) return undefined;

    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    return Between(start, end);
  }
}

