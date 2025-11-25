/// <reference path="../../../../types/express.d.ts" />

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return {
      userId: request.userId,
      userType: request.userType,
    };
  },
);
