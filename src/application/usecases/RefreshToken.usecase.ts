import crypto from 'crypto';
import { inject, injectable } from 'inversify';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TYPES } from '../../di/Types';
import { ConfigService } from '../../infrastructure/config/ConfigService';
import { UnauthorizedError } from '../errors/AppError';
import { RefreshTokenRepository } from '../ports/RefreshTokenRepository';

@injectable()
export class RefreshToken {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepo: RefreshTokenRepository,
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
  ) {}

  async execute(input: Input): Promise<Output> {
    let decodedRefreshToken: JwtPayload;
    try {
      const payload = jwt.verify(
        input.refreshToken,
        this.configService.jwtRefreshSecret,
      );
      if (typeof payload === 'string') throw new UnauthorizedError();
      decodedRefreshToken = payload;
    } catch (error) {
      throw new UnauthorizedError('Refresh token expired or invalid');
    }
    if (
      !decodedRefreshToken.jti ||
      !decodedRefreshToken.exp ||
      !decodedRefreshToken.id
    ) {
      throw new UnauthorizedError('Invalid refresh token payload');
    }
    const isTokenRevoked = await this.refreshTokenRepo.exists(
      decodedRefreshToken.jti,
    );
    if (isTokenRevoked) {
      console.log(
        `Revoked token used. Potential security risk for ${decodedRefreshToken.id} user.`,
      );
      throw new UnauthorizedError('Invalid Credentials.');
    }
    await this.refreshTokenRepo.add(
      decodedRefreshToken.jti,
      decodedRefreshToken.exp,
    );
    const accessToken = jwt.sign(
      {
        id: decodedRefreshToken.id,
        userType: decodedRefreshToken.userType,
      },
      this.configService.jwtAccessSecret,
      {
        expiresIn: 60 * 5,
        subject: 'accessToken',
        jwtid: crypto.randomUUID(),
      },
    );
    const refreshToken = jwt.sign(
      {
        id: decodedRefreshToken.id,
        userType: decodedRefreshToken.userType,
      },
      this.configService.jwtRefreshSecret,
      { subject: 'refreshToken', expiresIn: '1w', jwtid: crypto.randomUUID() },
    );
    return { accessToken, refreshToken };
  }
}

interface Input {
  refreshToken: string;
}

interface Output {
  accessToken: string;
  refreshToken: string;
}
