import { TestingModule, Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/users/interfaces/user.interface';
import { createMock } from '@golevelup/ts-jest';
import { Token } from 'src/tokens/dtos';

describe('AuthController', () => {
  const id = 'id';
  const token = 'token';
  const expiresIn = 60;

  let authController: AuthController;
  let authService: AuthService;
  let tokensService: TokensService;
  let usersService: UsersService;

  let userMock: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: TokensService,
          useValue: {
            generateAccessTokenFromRefreshToken: jest.fn(),
            formatToken: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(),
            getUserByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
      controllers: [AuthController],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(AuthGuard('jwt'))
      .compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
    tokensService = module.get(TokensService);
    usersService = module.get(UsersService);

    userMock = createMock<User>({
      id,
    });
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should login successfully', async () => {
    const response = {
      accessToken: {
        token,
        expiresIn,
      },
      refreshToken: {
        token,
        expiresIn,
      },
    };

    const loginSpy = jest
      .spyOn(authService, 'login')
      .mockResolvedValue(response);

    expect(await authController.login(userMock)).toEqual(response);
    expect(loginSpy).toHaveBeenCalledWith(userMock);
  });

  it('should logout successfully', async () => {
    const logoutSpy = jest.spyOn(authService, 'logout');

    expect(await authController.logout(userMock)).toEqual(true);
    expect(logoutSpy).toHaveBeenCalledWith(id);
  });

  describe('register', () => {
    const credentials = { username: 'username', password: 'password' };

    it('should register successfully', async () => {
      const getUserByUsernameSpy = jest.spyOn(
        usersService,
        'getUserByUsername',
      );
      const createSpy = jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValue(userMock);
      const loginSpy = jest.spyOn(authService, 'login').mockResolvedValue({
        accessToken: {
          token,
          expiresIn,
        },
        refreshToken: {
          token,
          expiresIn,
        },
      });

      expect(await authController.register(credentials)).toEqual({
        accessToken: {
          token,
          expiresIn,
        },
        refreshToken: {
          token,
          expiresIn,
        },
      });
      expect(createSpy).toHaveBeenCalledWith(credentials);
      expect(loginSpy).toHaveBeenCalledWith(userMock);
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(credentials.username);
    });

    it('should throw conflict exception if given username already exists', async () => {
      const getUserByUsernameSpy = jest
        .spyOn(usersService, 'getUserByUsername')
        .mockResolvedValue(userMock);
      const createSpy = jest.spyOn(usersService, 'createUser');

      const loginSpy = jest.spyOn(authService, 'login');

      expect(authController.register(credentials)).rejects.toThrow(
        ConflictException,
      );
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(credentials.username);
      expect(createSpy).not.toHaveBeenCalled();
      expect(loginSpy).not.toHaveBeenCalled();
    });
  });

  it('should return user profile', async () => {
    const findOneSpy = jest
      .spyOn(usersService, 'getUserById')
      .mockResolvedValue(userMock);

    expect(await authController.profile(userMock)).toEqual(userMock);
    expect(findOneSpy).toHaveBeenCalledWith(userMock.id);
  });

  describe('refresh', () => {
    let tokenMock: Token;

    beforeEach(() => {
      tokenMock = createMock<Token>({
        token,
        expiresIn,
      });
    });

    it('should refresh token successfully', async () => {
      const refreshToken = 'refreshToken';
      const accessToken = 'accessToken';

      const generateAccessTokenFromRefreshTokenSpy = jest
        .spyOn(tokensService, 'generateAccessTokenFromRefreshToken')
        .mockResolvedValue(accessToken);
      const formatTokenSpy = jest
        .spyOn(tokensService, 'formatToken')
        .mockResolvedValue(tokenMock);

      expect(await authController.refresh({ refreshToken })).toEqual({
        accessToken: tokenMock,
      });
      expect(generateAccessTokenFromRefreshTokenSpy).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(formatTokenSpy).toHaveBeenCalledWith(accessToken);
    });

    it('should throw unauthorized exception if refresh token is invalid', async () => {
      const refreshToken = 'invalid';

      const generateAccessTokenFromRefreshTokenSpy = jest.spyOn(
        tokensService,
        'generateAccessTokenFromRefreshToken',
      );
      const formatTokenSpy = jest.spyOn(tokensService, 'formatToken');

      expect(authController.refresh({ refreshToken })).rejects.toThrow(
        UnauthorizedException,
      );
      expect(generateAccessTokenFromRefreshTokenSpy).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(formatTokenSpy).not.toHaveBeenCalled();
    });
  });
});
