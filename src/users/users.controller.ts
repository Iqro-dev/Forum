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
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiQuery({
    name: 'username',
    required: false,
    type: String,
    description: 'Filter users by username',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Filter users by email',
  })
  getUsers(
    @Query() { username, email }: Pick<CreateUserDto, 'username' | 'email'>,
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
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'User ID',
  })
  getUserById(@Param('id') id: string): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @ApiBody({
    type: CreateUserDto,
    description: 'Create a new user',
  })
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
