import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto, UpdateUserDto } from "src/dto/users.dto";
import { UsersFilter } from "src/dto/filters/users.filter";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {

    @Inject(UsersService)
    private readonly _usersService: UsersService;

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this._usersService.create(createUserDto);
    }

    @Get()
    async findAll(@Query() paginationDto: UsersFilter) {
        return this._usersService.findAll(paginationDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {

        if (isNaN(+id)) {
            throw new BadRequestException('ID inválido');
        }


        return await this._usersService.findById(+id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

        if (isNaN(+id)) {
            throw new BadRequestException('ID inválido');
        }


        return await this._usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {

        if (isNaN(+id)) {
            throw new BadRequestException('ID inválido');
        }

        return this._usersService.remove(+id);
    }
}