import { ExecutionContext } from '@nestjs/common';

import { getCurrentUser } from './current-user.decorator';

import { User } from 'src/users/interfaces/user.interface';
import { createMock } from '@golevelup/ts-jest';

describe('CurrentUser', () => {
  it('should be defined', () => {
    expect(getCurrentUser).toBeDefined();
  });

  it('should return current user', () => {
    const userMock = createMock<User>();
    const contextMock = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          user: userMock,
        }),
      }),
    } as ExecutionContext);

    expect(getCurrentUser(undefined, contextMock)).toEqual(userMock);
  });
});
