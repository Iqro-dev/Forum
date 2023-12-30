import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

import { getCurrentUser } from './current-user.decorator';

import { User } from 'src/users/interfaces/user.interface';

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
