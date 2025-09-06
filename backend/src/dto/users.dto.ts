import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { getCurrentTimeString } from "src/utils/getCurrentTimeString";

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    created_at?: string = getCurrentTimeString();

    @IsOptional()
    updated_at?: string = getCurrentTimeString();

}

export class UpdateUserDto {

    @IsOptional()
    @IsString()
    @MinLength(2)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;

    @IsOptional()
    updated_at?: string = getCurrentTimeString();

}