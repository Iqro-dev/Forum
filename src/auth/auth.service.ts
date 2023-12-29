import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/interfaces/user.interface';
import { Payload } from 'src/tokens/dtos';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getUserByUsername(username);

    if (!user || !(await compare(password, user.password))) return;

    return user;
  }

  async login({ id, username }: User) {
    const payload: Payload = { sub: id, username };

    const accessToken = await this.tokensService.generateAccessToken(payload);
    const refreshToken = await this.tokensService.generateRefreshToken(payload);

    await this.usersService.setCurrentRefreshToken(id ?? '0', refreshToken);

    return {
      accessToken: await this.tokensService.formatToken(accessToken),
      refreshToken: await this.tokensService.formatToken(refreshToken),
    };
  }

  async logout(id: string) {
    return await this.usersService.deleteRefreshToken(id);
  }
}
