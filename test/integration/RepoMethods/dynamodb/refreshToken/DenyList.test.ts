import { RefreshTokenRepository } from '../../../../../src/application/ports/refreshTokenRepository';
import { container } from '../../../../../src/di/inversify.config';
import { TYPES } from '../../../../../src/di/types';
import { randomUUID } from 'crypto';

describe('DynamoDbRefreshTokensRepo - Deny List Functionality', () => {
  let refreshTokenRepo: RefreshTokenRepository;

  beforeAll(() => {
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
  });

  it('should add a jti to the deny list and confirm it exists', async () => {
    const jti = randomUUID();
    const expiresIn = Math.floor(Date.now() / 1000) + 3600; // Expires in 1 hour

    // Ensure it doesn't exist initially
    const initialExists = await refreshTokenRepo.exists(jti);
    expect(initialExists).toBe(false);

    // Add it to the deny list
    await refreshTokenRepo.add(jti, expiresIn);

    // Verify it now exists
    const finalExists = await refreshTokenRepo.exists(jti);
    expect(finalExists).toBe(true);
  });

  it('should return false for a jti that has not been added', async () => {
    const jti = randomUUID();
    const exists = await refreshTokenRepo.exists(jti);
    expect(exists).toBe(false);
  });

  // Note: Testing the actual TTL deletion is difficult in integration tests
  // as it depends on DynamoDB's internal, non-instantaneous process.
});

