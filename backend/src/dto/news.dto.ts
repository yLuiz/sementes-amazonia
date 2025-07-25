
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsDateString } from 'class-validator';

export class CreateNewsDto {

  @ApiProperty({ description: 'Title of the news article', example: 'Breaking News: Major Event Happens' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  titulo: string;

  @ApiProperty({ description: 'Summary of the news article', example: 'This is a brief summary of the news article.' })
  @IsString()
  @IsNotEmpty()
  resumo: string;

  @ApiProperty({ description: 'Publication date of the news article', example: '2023-10-01T12:00:00Z' })
  @IsDateString()
  dataPublicacao: string;

  @ApiProperty({ description: 'Tags associated with the news article', example: 'news, breaking, event', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ description: 'Full content of the news article', example: 'This is the full content of the news article.' })
  @IsString()
  @IsNotEmpty()
  conteudoCompleto: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the news article', example: 'https://example.com/image.jpg', required: false, type: 'string',
    format: 'binary'
  })
  @IsOptional()
  @IsString()
  imagemThumb?: string;
}

export class UpdateNewsDto {

  @ApiProperty({ description: 'Title of the news article', example: 'Updated News Title', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  titulo?: string;

  @ApiProperty({ description: 'Summary of the news article', example: 'Updated summary of the news article.', required: false })
  @IsOptional()
  @IsString()
  resumo?: string;

  @ApiProperty({ description: 'Publication date of the news article', example: '2023-10-01T12:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  dataPublicacao?: string;

  @ApiProperty({ description: 'Tags associated with the news article', example: 'news, updated', required: false })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiProperty({ description: 'Full content of the news article', example: 'Updated full content of the news article.', required: false })
  @IsOptional()
  @IsString()
  conteudoCompleto?: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the news article', example: 'https://example.com/image.jpg', required: false, type: 'string',
    format: 'binary'
  })
  @IsOptional()
  imagemThumb?: string;   
}
