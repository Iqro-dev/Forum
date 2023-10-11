import { UserDto } from './dtos/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  getUsers() {
    return 'All users returned';
  }

  getUser(id: string) {
    return `User ${id} returned`;
  }

  createUser(userDto: UserDto) {
    return `User ${userDto.name} ${userDto.surname} created`;
  }

  updateUser(id: string, userDto: UserDto) {
    return `User with id ${id} updated. ${userDto.name}`;
  }

  deleteUser(id: string) {
    return `User ${id} deleted`;
  }
}
