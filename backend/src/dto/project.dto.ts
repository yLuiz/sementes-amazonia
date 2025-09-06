
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { getCurrentTimeString } from 'src/utils/getCurrentTimeString';

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

  @ApiProperty({
    description: 'Thumbnail image URL for the project',
    example: 'https://example.com/image.jpg',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image_thumb?: string;

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
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'This is a brief summary of the project.',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    description: 'Full description of the project',
    example: 'This is the full description of the project.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the project',
    example: 'https://example.com/image.jpg',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image_thumb?: string;

  @IsOptional()
  updated_at?: string = getCurrentTimeString();

}
