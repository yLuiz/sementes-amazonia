
import { IsIn, IsOptional, IsInt, Max, Min } from 'class-validator';
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
  // O site envia em maiúsculas e o padrão é em minúsculas; os dois valem.
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
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
  @Max(1_000_000)
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
  @Max(1000)
  limit?: number = 10;
}
