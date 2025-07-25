
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    description: 'Name of the project',
    example: 'Project Alpha',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'This is a brief summary of the project.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  resumo: string;

  @ApiProperty({
    description: 'Full description of the project',
    example: 'This is the full description of the project.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  descricaoCompleta: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the project',
    example: 'https://example.com/image.jpg',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  imagemThumb?: string;
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
  nome?: string;

  @ApiProperty({
    description: 'Summary of the project',
    example: 'This is a brief summary of the project.',
    required: false,
  })
  @IsOptional()
  @IsString()
  resumo?: string;

  @ApiProperty({
    description: 'Full description of the project',
    example: 'This is the full description of the project.',
    required: false,
  })
  @IsOptional()
  @IsString()
  descricaoCompleta?: string;

  @ApiProperty({
    description: 'Thumbnail image URL for the project',
    example: 'https://example.com/image.jpg',
    required: false,
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  imagemThumb?: string;
}
