import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const result = 'All users returned';

      jest.spyOn(usersService, 'getUsers').mockImplementation(() => result);

      expect(await usersController.getUsers()).toBe(result);
    });
  });

  describe('getUser', () => {
    it('should return user with given id', async () => {
      const id = '3';

      const result = `User ${id} returned`;

      jest.spyOn(usersService, 'getUser').mockImplementation(() => result);

      expect(await usersController.getUser(id)).toBe(result);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userMock = { name: 'John', surname: 'Doe' };

      const result = `User ${userMock.name} ${userMock.surname} created`;

      jest.spyOn(usersService, 'createUser').mockImplementation(() => result);

      expect(await usersController.createUser(userMock)).toBe(result);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const id = '3';

      const userMock = { name: 'John', surname: 'Doe' };

      const result = `User with id ${id} updated. ${userMock.name}`;

      jest.spyOn(usersService, 'updateUser').mockImplementation(() => result);

      expect(await usersController.updateUser(id, userMock)).toBe(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete user with given id', async () => {
      const id = '3';

      const result = `User ${id} deleted`;

      jest.spyOn(usersService, 'deleteUser').mockImplementation(() => result);

      expect(await usersController.deleteUser(id)).toBe(result);
    });
  });
});
