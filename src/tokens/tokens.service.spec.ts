import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { TokensService } from './tokens.service';
import { Payload } from './dtos';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/interfaces/user.interface';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

describe('TokensService', () => {
  const token = 'token';
  const username = 'username';
  const id = 'id';
  const time = '60s';

  let tokensService: TokensService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  let userMock: User;
  let payloadMock: Payload;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokensService,
        {
          provide: UsersService,
          useValue: {
            getUserByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            decode: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    tokensService = module.get(TokensService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);

    userMock = createMock<User>({
      id,
      username,
    });

    payloadMock = createMock<Payload>({
      username,
      sub: id,
    });
  });

  it('should be defined', () => {
    expect(tokensService).toBeDefined();
  });

  it('should verify token', async () => {
    const verifyAsyncSpy = jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue(payloadMock);

    expect(await tokensService.verify(token)).toEqual(payloadMock);

    expect(verifyAsyncSpy).toHaveBeenCalledWith(token);
  });

  it('should generate access token', () => {
    const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    jest.spyOn(configService, 'get').mockReturnValue(time);

    expect(tokensService.generateAccessToken(payloadMock)).toEqual('token');
    expect(signSpy).toHaveBeenCalledWith(payloadMock, {
      expiresIn: time,
      secret: time,
    });
  });

  it('should generate refresh token', () => {
    const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    jest.spyOn(configService, 'get').mockReturnValue(time);

    expect(tokensService.generateRefreshToken(payloadMock)).toEqual('token');
    expect(signSpy).toHaveBeenCalledWith(payloadMock, {
      expiresIn: time,
      secret: time,
    });
  });

  describe('generateAccessTokenFromRefreshToken', () => {
    it('should generate access token from refresh token', async () => {
      const decodeSpy = jest
        .spyOn(jwtService, 'decode')
        .mockReturnValue(payloadMock);
      const getUserByUsernameSpy = jest
        .spyOn(usersService, 'getUserByUsername')
        .mockResolvedValue(userMock);
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue(token);
      jest.spyOn(configService, 'get').mockReturnValue(time);

      expect(
        await tokensService.generateAccessTokenFromRefreshToken(token),
      ).toEqual(token);

      expect(decodeSpy).toHaveBeenCalledWith(token);
      expect(signSpy).toHaveBeenCalledWith(payloadMock, {
        expiresIn: time,
        secret: time,
      });
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(username);
    });

    it('should not generate access token because of invalid payload', async () => {
      const decodeSpy = jest
        .spyOn(jwtService, 'decode')
        .mockReturnValue({ username });

      expect(
        await tokensService.generateAccessTokenFromRefreshToken(token),
      ).toBeUndefined();

      expect(decodeSpy).toHaveBeenCalledWith(token);
    });

    it('should not generate access token because of invalid user', async () => {
      const decodeSpy = jest.spyOn(jwtService, 'decode').mockReturnValue({
        username,
      });

      const getUserByUsernameSpy = jest.spyOn(
        usersService,
        'getUserByUsername',
      );

      expect(
        await tokensService.generateAccessTokenFromRefreshToken(token),
      ).toBeUndefined();

      expect(getUserByUsernameSpy).toHaveBeenCalledWith(username);
      expect(decodeSpy).toHaveBeenCalledWith(token);
    });
  });

  it('should format token', async () => {
    const verifyAsyncSpy = jest
      .spyOn(jwtService, 'decode')
      .mockResolvedValue(payloadMock as never);

    expect(await tokensService.formatToken(token)).toEqual({
      token,
      expiresIn: payloadMock.exp,
    });
    expect(verifyAsyncSpy).toHaveBeenCalledWith(token);
  });
});
