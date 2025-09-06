import { ApiProperty } from "@nestjs/swagger";
import { PaginationFilter } from "./pagination.filter";
import { IsOptional } from "class-validator";

export enum UserOrderBy {
    ID = 'id',
    USERNAME = 'username',
    EMAIL = 'email',
    CREATED_AT = 'created_at',
}

export class UsersFilter extends PaginationFilter {
    @ApiProperty({
        type: String,
        example: 'admin@example.com',
        required: false,
    })
    @IsOptional()
    email?: string;

    @ApiProperty({
        type: String,
        example: 'admin',
        required: false,
    })
    @IsOptional()
    username?: string;

    @ApiProperty({
        enum: UserOrderBy,
        type: String,
        description: 'Campo para ordenação. (id, username, email, created_at)',
        example: UserOrderBy.CREATED_AT,
        required: false,
    })
    @IsOptional()
    orderBy?: UserOrderBy = UserOrderBy.ID;
}
