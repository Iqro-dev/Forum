import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { Payload, Token } from './dtos';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async verify(token: string) {
    return this.jwtService.verifyAsync<Payload>(token);
  }

  generateAccessToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  generateRefreshToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async generateAccessTokenFromRefreshToken(refreshToken: string) {
    const decodedPayload = this.jwtService.decode<Payload>(refreshToken);

    if (!decodedPayload.username) return;

    const user = await this.usersService.getUserByUsername(
      decodedPayload.username,
    );

    if (!user?.refreshToken) return;

    if (!(await compare(refreshToken, user.refreshToken))) return;

    const { id, username } = user;

    const payload: Payload = {
      sub: id,
      username,
    };

    return this.generateAccessToken(payload);
  }

  async formatToken(token: string): Promise<Token | undefined> {
    const decodedPayload =
      await this.jwtService.decode<Promise<Payload | undefined>>(token);

    if (!decodedPayload || typeof decodedPayload === 'string') return;

    const { exp: expiresIn = 0 } = decodedPayload;

    return {
      token,
      expiresIn,
    };
  }
}
