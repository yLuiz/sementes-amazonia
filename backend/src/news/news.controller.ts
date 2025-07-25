
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
import { NewsService } from './news.service';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { multerConfig } from '../config/multer.config';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('News')
@Controller('api/v1/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @ApiConsumes('multipart/form-data')
  // @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('imagemThumb', multerConfig))
  async create(
    @Body() createNewsDto: CreateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    

    if (file) {
      createNewsDto['imagemThumb'] = file.filename;
    }
    return this.newsService.create(createNewsDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.newsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateNewsDto: UpdateNewsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateNewsDto['imagemThumb'] = file.filename;
    }
    return this.newsService.update(+id, updateNewsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.newsService.remove(+id);
    return { message: 'Notícia deletada com sucesso' };
  }
}
