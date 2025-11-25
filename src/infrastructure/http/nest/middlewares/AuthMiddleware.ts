/// <reference path="../../../../types/express.d.ts" />

import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
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
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(TYPES.ConfigService) private configService: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

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

      (req as any).userId = decodedToken.id;
      (req as any).userType = decodedToken.userType;

      next();
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
