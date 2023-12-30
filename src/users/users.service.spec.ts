import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndRemove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersModel = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result = createMock<User[]>();

      jest.spyOn(usersModel, 'find').mockResolvedValue(result);

      expect(await usersService.getUsers()).toBe(result);
    });
  });

  describe('getUserById', () => {
    it('should find by id and return a single user', async () => {
      const result = createMock<User>();

      jest.spyOn(usersModel, 'findOne').mockResolvedValue(result);

      expect(await usersService.getUserById('1')).toBe(result);
    });
  });

  describe('getUserByUsername', () => {
    it('should  find by username return a single user', async () => {
      const result = createMock<User>();

      jest.spyOn(usersModel, 'findOne').mockResolvedValue(result);

      expect(await usersService.getUserByUsername('John')).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const result = createMock<User>();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jest.spyOn(usersModel, 'create').mockResolvedValue(result as never);

      expect(await usersService.createUser(result)).toBe(result);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = createMock<User>();

      jest.spyOn(usersModel, 'findByIdAndUpdate').mockResolvedValue(result);

      expect(await usersService.updateUser('1', result)).toBe(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const result = createMock<User>();

      jest.spyOn(usersModel, 'findByIdAndRemove').mockResolvedValue(result);

      expect(await usersService.deleteUser('1')).toBe(result);
    });
  });
});
