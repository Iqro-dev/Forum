import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { User } from '../../users/schemas/user.schema';

export function getCurrentUser(data, context: ExecutionContext): User {
  const request = context.switchToHttp().getRequest();

  return request.user;
}

export const CurrentUser = createParamDecorator(getCurrentUser);
