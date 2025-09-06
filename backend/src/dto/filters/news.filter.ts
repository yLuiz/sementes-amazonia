import { ApiProperty } from "@nestjs/swagger";
import { PaginationFilter } from "./pagination.filter";
import { IsOptional } from "class-validator";

export enum NewsOrderBy {
    ID = 'id',
    TITLE = 'title',
    CREATED_AT = 'created_at',
    PUBLISHED_AT = 'published_at',
    UPDATED_AT = 'updated_at',
}

export class NewsFilter extends PaginationFilter {

    @ApiProperty({
        type: String,
        description: 'Título da notícia',
        example: 'Nova descoberta na Amazônia',
        required: false,
    })
    @IsOptional()
    title?: string;

    @ApiProperty({
        type: String,
        description: 'Tags associadas à notícia',
        example: 'meio ambiente, conservação',
        required: false,
    })
    @IsOptional()
    tags?: string;

    @ApiProperty({
        type: Date,
        description: 'Data de publicação da notícia',
        example: '2023-03-15T12:00:00Z',
        required: false,
    })
    @IsOptional()
    publishedAt?: Date;

    @ApiProperty({
        type: Date,
        description: 'Data de criação da notícia',
        example: '2023-03-15T12:00:00Z',
        required: false,
    })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({
        type: Date,
        description: 'Data de atualização da notícia',
        example: '2023-03-15T12:00:00Z',
        required: false,
    })
    @IsOptional()
    updatedAt?: Date;

    @ApiProperty({
        type: String,
        enum: NewsOrderBy,
        description: 'Campo para ordenação. (id, title, createdAt, updatedAt)',
        example: NewsOrderBy.CREATED_AT,
        required: false,
    })
    @IsOptional()
    orderBy?: NewsOrderBy = NewsOrderBy.ID;

}