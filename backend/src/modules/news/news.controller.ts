
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
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsService } from './news.service';

import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerConfig } from 'src/config/multer.config';
import { CreateNewsDto, UpdateNewsDto } from 'src/dto/news.dto';
import { PaginationDto } from 'src/dto/pagination.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('News')
@Controller('api/v1/news')
export class NewsController {

  @Inject(NewsService)
  private readonly _newsService: NewsService;

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
    return this._newsService.create(createNewsDto);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return this._newsService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._newsService.findOne(+id);
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
    return this._newsService.update(+id, updateNewsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this._newsService.remove(+id);
    return { message: 'Notícia deletada com sucesso' };
  }
}
