import { TestingModule, Test } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';

import { AuthService } from '../auth.service';

import { LocalStrategy } from './local-strategy';

import { User } from 'src/users/interfaces/user.interface';

describe('LocalStrategy', () => {
  const username = 'username';
  const password = 'password';

  let localStrategy: LocalStrategy;
  let authService: AuthService;
  let userMock: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);

    userMock = createMock<User>({
      username,
      password,
    });
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if username and password are valid', async () => {
      const validateUserSpy = jest
        .spyOn(authService, 'validateUser')
        .mockResolvedValue(userMock);

      expect(await localStrategy.validate(username, password)).toEqual(
        userMock,
      );
      expect(validateUserSpy).toHaveBeenCalledWith(username, password);
    });

    it('should throw unauthorized exception if username or password are invalid', async () => {
      const validateUserSpy = jest.spyOn(authService, 'validateUser');

      await expect(
        localStrategy.validate(username, password),
      ).rejects.toThrow();
      expect(validateUserSpy).toHaveBeenCalledWith(username, password);
    });
  });
});
