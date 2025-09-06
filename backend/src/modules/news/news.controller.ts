
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

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { multerConfig } from 'src/config/multer.config';
import { CreateNewsDto, UpdateNewsDto } from 'src/dto/news.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { NewsFilter } from 'src/dto/filters/news.filter';

@ApiTags('News')
@Controller('api/v1/news')
export class NewsController {

  @Inject(NewsService)
  private readonly _newsService: NewsService;

  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  async findAll(@Query() newsFilter: NewsFilter) {
    return this._newsService.findAll(newsFilter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this._newsService.findOne(+id);
  }

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this._newsService.remove(+id);
    return { message: 'Notícia deletada com sucesso' };
  }
}
