
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/dto/pagination.dto';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import { Project } from 'src/entities/project.entity';
import { Repository } from 'typeorm';


@Injectable()
export class ProjectsService {

  @InjectRepository(Project)
  private projectsRepository: Repository<Project>;

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create(createProjectDto);
    return this.projectsRepository.save(project);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [projects, total] = await this.projectsRepository.findAndCount({
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data: projects,
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
}
