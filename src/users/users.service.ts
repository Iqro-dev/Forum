import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getUser(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  async createUser(user: User): Promise<User> {
    return await this.userModel.create(user);
  }

  async updateUser(id: string, user: User): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndRemove(id);
  }
}
