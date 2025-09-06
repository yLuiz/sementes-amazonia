
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { UserOrderBy, UsersFilter } from 'src/dto/filters/users.filter';
import { CreateUserDto } from 'src/dto/users.dto';
import { User } from 'src/entities/user.entity';
import { parseDateToString } from 'src/utils/parseDateToString';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {

  @InjectRepository(User)
  private _usersRepository: Repository<User>;

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this._usersRepository.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });
    return this._usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this._usersRepository.findOne({ where: { email } });
  }

  async findAll(usersFilter: UsersFilter) {
    const { page = 1, limit = 10 } = usersFilter;
    const skip = (page - 1) * limit;

    let orderField = 'created_at';
    if (usersFilter.orderBy) {
      const validFields = Object.values(UserOrderBy);
      if (validFields.includes(usersFilter.orderBy)) {
        orderField = usersFilter.orderBy;
      }
    }

    const order = {
      [orderField]: usersFilter.direction ? usersFilter.direction : 'desc',
    }

    const [users, total] = await this._usersRepository.findAndCount({
      skip,
      take: limit,
      where: {
        email: usersFilter.email ? Like(`%${usersFilter.email}%`) : undefined,
        username: usersFilter.username ? Like(`%${usersFilter.username}%`) : undefined,
      },
      order
    });

    return {
      data: users.map(u => ({
        ...u,
        created_at: parseDateToString(u.created_at),
        updated_at: parseDateToString(u.updated_at),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUsername(username: string): Promise<User | null> {
    return this._usersRepository.findOne({ where: { username } });
  }

  async findById(id: number): Promise<User | null> {
    return this._usersRepository.findOne({ where: { id } });
  }

  async updatePassword(id: number, hashedPassword: string): Promise<void> {
    await this._usersRepository.update(id, { password: hashedPassword });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User> {

    const userExists = await this._usersRepository.findOne({ where: { id } });

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const emailAlreadyInUse = await this._usersRepository.findOne({ where: { email: updateUserDto.email } });
    if (emailAlreadyInUse && emailAlreadyInUse.id !== id) {
      throw new NotFoundException('Email já está em uso por outro usuário.');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(userExists, updateUserDto);
    return await this._usersRepository.save(userExists);
  }

  async remove(id: number): Promise<void> {
    const user = await this._usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    await this._usersRepository.remove(user);
  }

}
