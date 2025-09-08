/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { multerConfig } from 'src/config/multer.config';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import { ProjectsService } from './projects.service';
import { ProjectsFilter } from 'src/dto/filters/projects.filter';

@ApiTags('Projects')
@Controller('api/v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image_thumb', multerConfig))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createProjectDto['image_thumb'] = file.filename;
    }
    return await this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll(@Query() projectsFilters: ProjectsFilter) {
    return await this.projectsService.findAll(projectsFilters);
  }

  @Get('featured')
  async findFeatured() {

    const featuredProject = await this.projectsService.findFeatured();

    if (!featuredProject) {
      throw new BadRequestException('Nenhum projeto em destaque encontrado');
    }

    return featuredProject;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image_thumb', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProjectDto['image_thumb'] = file.filename;
    }
    return this.projectsService.update(+id, updateProjectDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(+id);
    return { message: 'Projeto deletado com sucesso' };
  }
}
