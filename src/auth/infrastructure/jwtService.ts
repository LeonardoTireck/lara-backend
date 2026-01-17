import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/configService';
import { TYPES } from '../../di/types';
import crypto from 'crypto';
import { UnauthorizedError } from '../../error/appError';
import { UserType } from '../../user/domain/userType';
import { RefreshToken } from '../../video/domain/refreshToken';

@injectable()
export class JwtService {
  constructor(
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
  ) {}

  createAccessToken(id: string, userType: UserType): string {
    return jwt.sign({ id, userType }, this.configService.jwtAccessSecret, {
      expiresIn: 60 * 5,
      subject: 'accessToken',
      jwtid: crypto.randomUUID(),
    });
  }

  createRefreshToken(
    id: string,
    userType: UserType,
  ): { tokenString: string; refreshTokenVO: RefreshToken } {
    const jti = crypto.randomUUID();
    const ttl = 7 * 24 * 60 * 60;
    const exp = Math.floor(Date.now() / 1000) + ttl;
    const tokenString = jwt.sign(
      { id, userType },
      this.configService.jwtRefreshSecret,
      {
        subject: 'refreshToken',
        expiresIn: `${ttl}s`,
        jwtid: jti,
      },
    );
    const refreshTokenVO = RefreshToken.fromClaims(id, jti, userType, exp);
    return { tokenString, refreshTokenVO };
  }

  decodeAndValidateAccessToken(tokenString: string): jwt.JwtPayload {
    try {
      const payload = jwt.verify(
        tokenString,
        this.configService.jwtAccessSecret,
      );
      if (
        typeof payload === 'string' ||
        !payload.jti ||
        !payload.id ||
        !payload.userType ||
        !payload.exp
      ) {
        throw new UnauthorizedError('Invalid refresh token payload');
      }
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token expired');
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  decodeAndValidateRefreshToken(tokenString: string) {
    try {
      const payload = jwt.verify(
        tokenString,
        this.configService.jwtRefreshSecret,
      );
      if (
        typeof payload === 'string' ||
        !payload.jti ||
        !payload.id ||
        !payload.userType ||
        !payload.exp
      ) {
        throw new UnauthorizedError('Invalid refresh token payload');
      }
      return RefreshToken.fromClaims(
        payload.id,
        payload.jti,
        payload.userType as UserType,
        payload.exp,
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Refresh token expired');
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }
}
