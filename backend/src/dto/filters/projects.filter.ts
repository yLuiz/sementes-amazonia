import { ApiProperty } from "@nestjs/swagger/dist/decorators/api-property.decorator";
import { PaginationFilter } from "./pagination.filter";
import { IsOptional } from "class-validator";

export enum ProjectsOrderBy {
    ID = 'id',
    TITLE = 'title',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
}


export class ProjectsFilter extends PaginationFilter {

    @ApiProperty({
        type: String,
        description: 'Título do projeto',
        example: 'Conservação da Amazônia',
        required: false,
    })
    @IsOptional()
    title?: string;

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
        enum: ProjectsOrderBy,
        description: 'Campo para ordenação. (id, title, createdAt, updatedAt)',
        example: ProjectsOrderBy.CREATED_AT,
        required: false,
    })
    @IsOptional()
    orderBy?: ProjectsOrderBy;

}