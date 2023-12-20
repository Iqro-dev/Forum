import { TestingModule, Test } from '@nestjs/testing';
import { compare } from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/users/interfaces/user.interface';
import { createMock } from '@golevelup/ts-jest';
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const id = 'id';
  const username = 'username';
  const password = 'password';
  const hashedPassword = 'hashedPassword';

  let authService: AuthService;
  let usersService: UsersService;
  let tokensService: TokensService;

  let userMock: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByUsername: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            setCurrentRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
          },
        },
        {
          provide: TokensService,
          useValue: {
            generateRefreshToken: jest.fn(),
            generateAccessToken: jest.fn(),
            formatToken: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get(AuthService);
    usersService = module.get(UsersService);
    tokensService = module.get(TokensService);

    userMock = createMock<User>({
      id,
      username,
      password: hashedPassword,
    });
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if username and password are valid', async () => {
      const getUserByUsernameSpy = jest
        .spyOn(usersService, 'getUserByUsername')
        .mockResolvedValue(userMock);
      const compareSpy = jest.mocked(compare).mockImplementation(() => true);

      expect(await authService.validateUser(username, password)).toEqual(
        userMock,
      );
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(username);
      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should return undefined if username is invalid', async () => {
      const getUserByUsernameSpy = jest.spyOn(
        usersService,
        'getUserByUsername',
      );

      expect(
        await authService.validateUser(username, password),
      ).toBeUndefined();
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(username);
    });

    it('should return undefined if password is invalid', async () => {
      const compareSpy = jest.mocked(compare).mockImplementation(() => false);

      const getUserByUsernameSpy = jest
        .spyOn(usersService, 'getUserByUsername')
        .mockResolvedValue(userMock);

      expect(
        await authService.validateUser(username, password),
      ).toBeUndefined();
      expect(getUserByUsernameSpy).toHaveBeenCalledWith(username);
      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  it('should login successfully', async () => {
    const token = 'token';
    const expiresIn = 60;

    const generateRefreshTokenSpy = jest
      .spyOn(tokensService, 'generateRefreshToken')
      .mockResolvedValue(token);
    const generateAccessTokenSpy = jest
      .spyOn(tokensService, 'generateAccessToken')
      .mockResolvedValue(token);
    const setCurrentRefreshTokenSpy = jest
      .spyOn(usersService, 'setCurrentRefreshToken')
      .mockResolvedValue(userMock);
    const formatTokenSpy = jest
      .spyOn(tokensService, 'formatToken')
      .mockResolvedValue({
        token,
        expiresIn,
      });

    expect(await authService.login(userMock)).toEqual({
      accessToken: {
        token,
        expiresIn,
      },
      refreshToken: {
        token,
        expiresIn,
      },
    });
    expect(generateRefreshTokenSpy).toHaveBeenCalledWith({
      sub: id,
      username,
    });
    expect(generateAccessTokenSpy).toHaveBeenCalledWith({
      sub: id,
      username,
    });
    expect(setCurrentRefreshTokenSpy).toHaveBeenCalledWith(id, token);
    expect(formatTokenSpy).toHaveBeenCalledWith(token);
  });

  it('should logout successfully', async () => {
    const deleteRefreshTokenSpy = jest
      .spyOn(usersService, 'deleteRefreshToken')
      .mockResolvedValue(userMock);

    expect(await authService.logout(id)).toEqual(userMock);
    expect(deleteRefreshTokenSpy).toHaveBeenCalledWith(id);
  });
});
