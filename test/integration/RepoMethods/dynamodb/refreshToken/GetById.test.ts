import { RefreshTokenRepository } from '../../../../../src/auth/application/interface/refreshTokenRepository';
import { container } from '../../../../../src/di/inversify.config';
import { TYPES } from '../../../../../src/di/types';

describe('DynamoDbRefreshTokensRepo - Exists', () => {
  let refreshTokenRepo: RefreshTokenRepository;
  const jti = 'jti-get-by-id-test';
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

  test('should return true if a refresh token exists in DynamoDB', async () => {
    await refreshTokenRepo.add(jti, tokenExpiresIn);
    const exists = await refreshTokenRepo.exists(jti);
    expect(exists).toBe(true);
  });

  test('should return false if a refresh token does not exist', async () => {
    const nonExistentJti = 'non-existent-jti';
    const exists = await refreshTokenRepo.exists(nonExistentJti);
    expect(exists).toBe(false);
  });
});
