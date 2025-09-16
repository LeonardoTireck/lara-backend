import { NotFoundError } from '../../../../../src/application/errors/AppError';
import { RefreshTokenRepository } from '../../../../../src/application/ports/RefreshTokenRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';

describe('DynamoDbRefreshTokensRepo - GetById', () => {
  let refreshTokenRepo: RefreshTokenRepository;
  const userId = 'user-get-by-id-test';

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

  test('should retrieve a refresh token by user ID from DynamoDB', async () => {
    const token = 'token-for-get-by-id-test';

    await refreshTokenRepo.save(token, userId);
    const retrievedToken = await refreshTokenRepo.getById(userId);

    expect(retrievedToken).toBe(token);
  });

  test('should throw NotFoundError if token for user ID does not exist', async () => {
    const nonExistentUserId = 'non-existent-get-by-id-user';
    await expect(refreshTokenRepo.getById(nonExistentUserId)).rejects.toThrow(
      NotFoundError,
    );
  });
});
