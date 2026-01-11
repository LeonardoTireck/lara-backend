import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { RefreshTokenRepository } from '../ports/refreshTokenRepository';
import { UnauthorizedError } from '../errors/appError';
import { ConfigService } from '../../infrastructure/config/configService';
import jwt from 'jsonwebtoken';

@injectable()
export class Logout {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokensRepo: RefreshTokenRepository,
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
  ) {}

  public async execute(input: Input): Promise<void> {
    const payload = jwt.verify(
      input.refreshToken,
      this.configService.jwtRefreshSecret,
    );

    if (
      typeof payload === 'string' ||
      !payload.jti ||
      !payload.exp ||
      !payload.id
    ) {
      throw new UnauthorizedError('Invalid refresh token payload');
    }

    const isTokenRevoked = await this.refreshTokensRepo.exists(payload.jti);

    if (isTokenRevoked) {
      console.log(
        `Revoked token used. Potential security risk for ${payload.id} user.`,
      );
      throw new UnauthorizedError('Invalid Credentials.');
    }

    await this.refreshTokensRepo.add(payload.jti, payload.exp);
  }
}

interface Input {
  refreshToken: string;
}
