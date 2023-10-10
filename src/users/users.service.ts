import { CreateUserDto } from './dtos/create.user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return 'All users returned';
  }

  getUser(id: string) {
    return `User ${id} returned`;
  }

  createUser(createUserDto: CreateUserDto) {
    return `User ${createUserDto.name} ${createUserDto.surname} created`;
  }

  deleteUser(id: string) {
    return `User ${id} deleted`;
  }
}
