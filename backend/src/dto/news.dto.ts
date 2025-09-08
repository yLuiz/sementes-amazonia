
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsDateString } from 'class-validator';
import { getCurrentTimeString } from 'src/utils/getCurrentTimeString';

export class CreateNewsDto {

  @ApiProperty({ description: 'Title of the news article', example: 'Breaking News: Major Event Happens' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({ description: 'Summary of the news article', example: 'This is a brief summary of the news article.' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ description: 'Full content of the news article', example: 'This is the full content of the news article.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Author of the news article', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({ description: 'Tags associated with the news article', example: 'news, breaking, event', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({
    description: 'Thumbnail image for the news article', required: false, type: 'string',
    format: 'binary'
  })
  @IsOptional()
  @IsString()
  image_thumb?: string;

  @ApiProperty({ description: 'Publication date of the news article', example: '2023-10-01T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @IsOptional()
  created_at?: string = getCurrentTimeString();

  @IsOptional()
  updated_at?: string = getCurrentTimeString();

}

export class UpdateNewsDto {

  @ApiProperty({ description: 'Title of the news article', example: 'Updated News Title', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiProperty({ description: 'Summary of the news article', example: 'Updated summary of the news article.', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'Publication date of the news article', example: '2023-10-01T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  published_at?: string;

  @ApiProperty({ description: 'Tags associated with the news article', example: 'news, updated', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ description: 'Full content of the news article', example: 'Updated full content of the news article.', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Author of the news article', example: 'Jane Smith', required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiProperty({
    description: 'Thumbnail image for the news article', required: false, type: 'string',
    format: 'binary'
  })
  @IsOptional()
  @IsString()
  image_thumb?: string;

  @IsOptional()
  updated_at?: string = getCurrentTimeString();
}
