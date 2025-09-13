import { RefreshTokenRepository } from '../../../../../src/application/ports/RefreshTokenRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';

describe('DynamoDbRefreshTokensRepo - Save', () => {
  let refreshTokenRepo: RefreshTokenRepository;

  beforeAll(() => {
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
  });

  test('should save a refresh token to DynamoDB', async () => {
    const userId = 'user-save-test';
    const token = 'token-for-save-test';

    await expect(refreshTokenRepo.save(token, userId)).resolves.not.toThrow();
  });
});
