import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/Types';
import { RefreshTokenRepository } from '../ports/RefreshTokenRepository';
import { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/AppError';

@injectable()
export class Logout {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokensRepo: RefreshTokenRepository,
  ) {}

  public execute = async (input: Input) => {
    if (typeof input.refreshToken == 'string') {
      throw new UnauthorizedError('Invalid refresh token');
    }
    if (
      !input.refreshToken.jti ||
      !input.refreshToken.exp ||
      !input.refreshToken.id
    ) {
      throw new UnauthorizedError('Invalid refresh token payload');
    }
    const isTokenRevoked = await this.refreshTokensRepo.exists(
      input.refreshToken.jti,
    );
    if (isTokenRevoked) {
      console.log(
        `Revoked token used. Potential security risk for ${input.refreshToken.id} user.`,
      );
      throw new UnauthorizedError('Invalid Credentials.');
    }
    await this.refreshTokensRepo.add(
      input.refreshToken.jti,
      input.refreshToken.exp,
    );
  };
}

interface Input {
  refreshToken: JwtPayload;
}
