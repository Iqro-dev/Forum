import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export function getAccessToken(data, context: ExecutionContext) {
  const request = context.switchToHttp().getRequest<Request>();

  return request.headers.authorization?.slice(7);
}

export const AccessToken = createParamDecorator(getAccessToken);
