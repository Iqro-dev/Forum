import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(
    @Query('username') username: string,
    @Query('email') email: string,
  ): Promise<User[] | User | null> {
    if (username) {
      return this.usersService.getUserByUsername(username);
    }

    if (email) {
      return this.usersService.getUserByEmail(email);
    }

    return this.usersService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string): Promise<User | null> {
    return this.usersService.getUserByUsername(username);
  }

  @Get(':email')
  getUserByEmail(@Param('email') email: string): Promise<User | null> {
    return this.usersService.getUserByEmail(email);
  }

  @Post()
  createUser(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User | null> {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateUserDto: CreateUserDto,
  ): Promise<User | null> {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<User | null> {
    return this.usersService.deleteUser(id);
  }
}
