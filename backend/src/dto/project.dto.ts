
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Project Alpha',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'This is a brief summary of the project.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({
    description: 'Full description of the project',
    example: 'This is the full description of the project.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
  name?: string;

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
  description?: string;

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
}
