import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Credentials } from 'src/auth/dtos/credentials.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUND = 10;

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async getUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username });
  }

  async createUser(user: User): Promise<User> {
    return await this.userModel.create({
      ...user,
      password: await hash(user.password, this.SALT_ROUND),
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.userModel.findByIdAndRemove(id);
  }

  async setCurrentRefreshToken(id: string, refreshToken: string) {
    return this.updateUser(id, {
      refreshToken: await hash(refreshToken, this.SALT_ROUND),
    });
  }

  deleteRefreshToken(id: string) {
    return this.updateUser(id, {
      refreshToken: null,
    });
  }
}
