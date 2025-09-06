
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsService } from './projects.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerConfig } from 'src/config/multer.config';
import { CreateProjectDto, UpdateProjectDto } from 'src/dto/project.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Projects')
@Controller('api/v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiConsumes('multipart/form-data')
  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imagemThumb', multerConfig))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createProjectDto['imagemThumb'] = file.filename;
    }
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.projectsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @ApiConsumes('multipart/form-data')
  // @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('imagemThumb', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProjectDto['imagemThumb'] = file.filename;
    }
    return this.projectsService.update(+id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(+id);
    return { message: 'Projeto deletado com sucesso' };
  }
}
