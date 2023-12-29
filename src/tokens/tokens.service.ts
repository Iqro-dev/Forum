import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

import { Payload, Token } from './dtos';

import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

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

  async generateAccessToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async generateRefreshToken(payload: Payload) {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async generateAccessTokenFromRefreshToken(refreshToken: string) {
    const decodedPayload = this.jwtService.decode(refreshToken);

    if (!decodedPayload || typeof decodedPayload === 'string') return;

    const user = await this.usersService.getUserByUsername(
      decodedPayload?.username,
    );

    if (!user) return;

    if (!(await compare(refreshToken, user.refreshToken))) return;

    const { id, username } = user;

    const payload: Payload = {
      sub: id,
      username,
    };

    return this.generateAccessToken(payload);
  }

  async formatToken(token: string): Promise<Token> {
    const decodedPayload = await this.jwtService.decode(token);

    if (!decodedPayload || typeof decodedPayload === 'string') return;

    const { exp: expiresIn } = decodedPayload;

    return {
      token,
      expiresIn,
    };
  }
}
