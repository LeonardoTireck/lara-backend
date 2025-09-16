import { RefreshTokenRepository } from '../../../../../src/application/ports/RefreshTokenRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';

describe('DynamoDbRefreshTokensRepo - Save', () => {
  let refreshTokenRepo: RefreshTokenRepository;
  const userId = 'user-save-test';

  beforeAll(() => {
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
  });

  afterAll(async () => {
    try {
      await refreshTokenRepo.delete(userId);
    } catch (error) {
      console.error(error);
    }
  });

  test('should save a refresh token to DynamoDB', async () => {
    const token = 'token-for-save-test';

    await expect(refreshTokenRepo.save(token, userId)).resolves.not.toThrow();
  });
});
