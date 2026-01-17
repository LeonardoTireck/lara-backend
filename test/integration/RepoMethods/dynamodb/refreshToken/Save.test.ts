import { RefreshTokenRepository } from '../../../../../src/auth/application/interface/refreshTokenRepository';
import { container } from '../../../../../src/di/inversify.config';
import { TYPES } from '../../../../../src/di/types';

describe('DynamoDbRefreshTokensRepo - Add', () => {
  let refreshTokenRepo: RefreshTokenRepository;
  const jti = 'jti-save-test';
  const tokenExpiresIn = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  beforeAll(() => {
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
  });

  afterAll(async () => {
    // Since there is no delete method, we cannot clean up directly.
    // This might require manual cleanup or a change in the RefreshTokenRepository interface.
  });

  test('should add a refresh token to DynamoDB', async () => {
    await expect(
      refreshTokenRepo.add(jti, tokenExpiresIn),
    ).resolves.not.toThrow();
    const exists = await refreshTokenRepo.exists(jti);
    expect(exists).toBe(true);
  });
});
