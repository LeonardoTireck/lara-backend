import crypto from 'crypto';
import { RefreshToken } from '../../../src/domain/valueObjects/refreshToken';
import { UserType } from '../../../src/domain/valueObjects/userType';

describe('Refresh Token Value Object Test', () => {
  it('Should create a new refresh token successfully', async () => {
    const input = {
      id: crypto.randomUUID(),
      userType: 'client' as UserType,
      jti: crypto.randomUUID(),
      exp: Math.floor(Date.now() / 1000),
    };
    const refreshToken = RefreshToken.fromClaims(
      input.jti,
      input.id,
      input.userType,
      input.exp,
    );
    expect(refreshToken).toBeDefined();
    expect(refreshToken.jti).toBeDefined();
    expect(refreshToken.id).toBeDefined();
    expect(refreshToken.userType).toBeDefined();
    expect(refreshToken.exp).toBeDefined();
  });
});
