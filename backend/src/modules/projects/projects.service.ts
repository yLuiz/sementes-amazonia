
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectsFilter, ProjectsOrderBy } from 'src/dto/filters/projects.filter';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import { Project } from 'src/entities/project.entity';
import { Between, Like, Repository } from 'typeorm';
import * as moment from 'moment';
import { parseDateToString } from 'src/utils/parseDateToString';


@Injectable()
export class ProjectsService {

  @InjectRepository(Project)
  private projectsRepository: Repository<Project>;

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
        title: projectsFilters.title ? Like(`%${projectsFilters.title}%`) : undefined,
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

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Projeto com ID ${id} não encontrado`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
  }

  private _buildDateRange(date?: Date | string) {
    if (!date) return undefined;

    const start = moment(date).startOf('day').toDate();
    const end = moment(date).endOf('day').toDate();

    return Between(start, end);
  }
}
