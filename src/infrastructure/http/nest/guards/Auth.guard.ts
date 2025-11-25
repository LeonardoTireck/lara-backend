/// <reference path="../../../../types/express.d.ts" />

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '../../../config/ConfigService';
import { UserType } from '../../../../domain/ValueObjects/UserType';
import {
  ForbiddenError,
  UnauthorizedError,
} from '../../../../application/errors/AppError';
import jwt from 'jsonwebtoken';
import { TYPES } from '../../../../di/Types';

interface DecodedToken {
  id: string;
  userType: UserType;
  jti: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TYPES.ConfigService) private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
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

      (request as any).userId = decodedToken.id;
      (request as any).userType = decodedToken.userType;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) throw error;
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        throw new UnauthorizedError('Token expired or invalid');
      }
      throw error;
    }
  }
}
