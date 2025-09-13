import { NotFoundError } from '../../../../../src/application/errors/AppError';
import { RefreshTokenRepository } from '../../../../../src/application/ports/RefreshTokenRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';

describe('DynamoDbRefreshTokensRepo - Delete', () => {
  let refreshTokenRepo: RefreshTokenRepository;

  beforeAll(() => {
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
  });

  test('should delete a refresh token from DynamoDB', async () => {
    const userId = 'user-delete-test';
    const token = 'token-for-delete-test';

    await refreshTokenRepo.save(token, userId);
    await refreshTokenRepo.delete(userId);

    await expect(refreshTokenRepo.getById(userId)).rejects.toThrow(
      NotFoundError,
    );
  });

  test('should throw an error if token for user ID to delete does not exist', async () => {
    const nonExistentUserId = 'non-existent-delete-user';
    await expect(refreshTokenRepo.delete(nonExistentUserId)).rejects.toThrow(
      NotFoundError,
    );
  });
});
