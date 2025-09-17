/// <reference path="../../../../types/fastify.d.ts" />

import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../di/Types';
import { ConfigService } from '../../../config/ConfigService';
import { UserType } from '../../../../domain/ValueObjects/UserType';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ForbiddenError,
  UnauthorizedError,
} from '../../../../application/errors/AppError';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  id: string;
  userType: UserType;
  jti: string;
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.ConfigService) private configService: ConfigService,
  ) {}

  public verify = (allowedRoles: UserType[]) => {
    return async (request: FastifyRequest, _reply: FastifyReply) => {
      const { authorization } = request.headers;
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid token');
      }

      const token = authorization.substring(7);
      try {
        const decodedToken = jwt.verify(
          token,
          this.configService.jwtAccessSecret,
        ) as DecodedToken;
        if (!decodedToken.id || !decodedToken.userType || !decodedToken.jti) {
          throw new UnauthorizedError('Invalid token payload');
        }
        if (!allowedRoles.includes(decodedToken.userType)) {
          throw new ForbiddenError();
        }
        request.userId = decodedToken.id;
      } catch (error) {
        if (error instanceof ForbiddenError) throw error;
        if (
          error instanceof jwt.JsonWebTokenError ||
          error instanceof jwt.TokenExpiredError
        ) {
          throw new UnauthorizedError('Token expired or invalid');
        }
      }
    };
  };
}
