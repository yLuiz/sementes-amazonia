
import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum Direction {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationFilter {

  @ApiProperty({
    enum: Direction,
    description: 'Direção da ordenação',
    example: Direction.DESC,
    required: false,
  })
  @IsOptional()
  direction?: Direction = Direction.DESC;

  @ApiProperty({
    type: Number,
    description: 'Número da página',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    type: Number,
    description: 'Número da itens por página',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
