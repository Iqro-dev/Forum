import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { User } from '../../users/schemas/user.schema';

export function getCurrentUser(data, context: ExecutionContext): User {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const request = context.switchToHttp().getRequest();

  console.log(request.user);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return request.user;
}

export const CurrentUser = createParamDecorator(getCurrentUser);
