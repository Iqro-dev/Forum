import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

import { getAccessToken } from './access-token.decorator';

describe('AccessToken', () => {
  it('should be defined', () => {
    expect(getAccessToken).toBeDefined();
  });

  it('should return access token from request', () => {
    const accessToken = 'access-token';
    const contextMock = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }),
      }),
    } as ExecutionContext);

    expect(getAccessToken(undefined, contextMock)).toEqual(accessToken);
  });

  it("should return undefined if access token isn't present", () => {
    const contextMock = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as ExecutionContext);

    expect(getAccessToken(undefined, contextMock)).toBeUndefined();
  });
});
