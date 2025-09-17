import { RefreshTokenRepository } from '../../../../../src/application/ports/RefreshTokenRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';
import { randomUUID } from 'crypto';

describe('DynamoDbRefreshTokensRepo - Deny List Functionality', () => {
  let refreshTokenRepo: RefreshTokenRepository;
  let jtiToCleanup: string | undefined; // Variable to hold JTI for cleanup

  beforeAll(() => {
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
  });

  afterEach(() => {
    // Reset the JTI variable for the next test.
    // Actual cleanup in DynamoDB relies on TTL, as there's no 'delete by JTI' method.
    jtiToCleanup = undefined;
  });

  it('should add a jti to the deny list and confirm it exists', async () => {
    const jti = randomUUID();
    jtiToCleanup = jti; // Assign JTI for cleanup
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