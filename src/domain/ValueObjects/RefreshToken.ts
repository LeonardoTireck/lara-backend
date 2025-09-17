import { ValidationError } from '../../application/errors/AppError';
import { UserType } from './UserType';

export class RefreshToken {
  private constructor(
    readonly id: string,
    readonly jti: string,
    readonly userType: UserType,
    readonly exp: number,
  ) {
    if (!id || !jti || !userType || !exp) {
      throw new ValidationError('Invalid refresh token claims.');
    }
  }

  static fromClaims(
    id: string,
    jti: string,
    userType: UserType,
    exp: number,
  ): RefreshToken {
    return new RefreshToken(id, jti, userType, exp);
  }

  public isExpired(): boolean {
    return this.exp < Math.floor(Date.now() / 1000);
  }
}
