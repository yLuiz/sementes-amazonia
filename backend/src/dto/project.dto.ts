
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from 'class-validator';
import { getCurrentTimeString } from '../utils/getCurrentTimeString';

// Em multipart tudo chega como texto, e o `Boolean('false')` daria verdadeiro.
// Outro valor segue sem conversão para o @IsBoolean recusar com 400.
export const toBooleanField = ({ value }: { value: unknown }): unknown => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

// Campo opcional na edição: pode faltar, mas `null` não passa (coluna NOT NULL).
const IfPresent = () => ValidateIf((_dto, value) => value !== undefined);

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Project Alpha',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'This is a brief summary of the project.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    description: 'Full content of the project',
    example: 'This is the full content of the project.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Author of the news article', example: 'Jane Smith', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the project',
    example: 'https://example.com/image.jpg',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_thumb?: string;

  @ApiProperty({
    description: 'Marca o projeto como destaque e desmarca os demais. Em multipart, "true" ou "false".',
    example: 'true',
    required: false,
    type: 'boolean',
  })
  @IfPresent()
  @Transform(toBooleanField)
  @IsBoolean({ message: 'is_featured deve ser "true" ou "false"' })
  is_featured?: boolean;

  @ApiProperty({ description: 'Publication date of the project', example: '2023-10-01T12:00:00Z' })
  @IsOptional()
  @IsDateString({ strict: true })
  published_at?: string;

  @IsOptional()
  created_at?: string = getCurrentTimeString();

  @IsOptional()
  updated_at?: string = getCurrentTimeString();

}

export class UpdateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Project Alpha',
    required: false,
  })
  @IfPresent()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'This is a brief summary of the project.',
    required: false,
  })
  @IfPresent()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: 'Full description of the project',
    example: 'This is the full description of the project.',
    required: false,
  })
  @IfPresent()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Author of the news article', example: 'Jane Smith', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  author?: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the project',
    example: 'https://example.com/image.jpg',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_thumb?: string;

  @ApiProperty({
    description: 'Marca o projeto como destaque e desmarca os demais. Em multipart, "true" ou "false".',
    example: 'true',
    required: false,
    type: 'boolean',
  })
  @IfPresent()
  @Transform(toBooleanField)
  @IsBoolean({ message: 'is_featured deve ser "true" ou "false"' })
  is_featured?: boolean;

  @ApiProperty({ description: 'Publication date of the project', example: '2023-10-01T12:00:00Z' })
  @IsOptional()
  @IsDateString({ strict: true })
  published_at?: string;

  @IsOptional()
  updated_at?: string = getCurrentTimeString();

}
