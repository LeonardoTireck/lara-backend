import jwt from 'jsonwebtoken';
import {
  NotFoundError,
  UnauthorizedError,
} from '../../../src/application/errors/AppError';
import { CreateUser } from '../../../src/application/usecases/CreateUser.usecase';
import { Login } from '../../../src/application/usecases/Login.usecase';
import { RefreshToken } from '../../../src/application/usecases/RefreshToken.usecase';
import { ConfigService } from '../../../src/infrastructure/config/ConfigService';
import BcryptPasswordHasher from '../../../src/infrastructure/hashing/BcryptPasswordHasher';
import { InMemoryRefreshTokenRepository } from '../../../src/infrastructure/inMemory/inMemoryRefreshTokenRepo';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/InMemoryUserRepo';
import { TrainingPlan } from '../../../src/domain/ValueObjects/TrainingPlan';

describe('RefreshToken Use Case', () => {
  let userRepo: InMemoryUserRepo;
  let refreshTokenRepo: InMemoryRefreshTokenRepository;
  let configService: ConfigService;
  let passwordHasher: BcryptPasswordHasher;
  let useCaseLogin: Login;
  let useCaseRefreshToken: RefreshToken;
  let createdUserId: string;
  let initialRefreshToken: string;

  const userEmail = 'refresh.token@test.com';
  const userPassword = 'Test123@';
  const userName = 'Refresh Token User';

  beforeEach(async () => {
    userRepo = new InMemoryUserRepo();
    refreshTokenRepo = new InMemoryRefreshTokenRepository();
    configService = new ConfigService();
    passwordHasher = new BcryptPasswordHasher(1);

    // Set secrets for testing
    process.env.JWT_SECRET = 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    configService = new ConfigService(); // Re-initialize to pick up env vars

    const useCaseCreate = new CreateUser(userRepo, passwordHasher);
    useCaseLogin = new Login(
      userRepo,
      refreshTokenRepo,
      passwordHasher,
      configService,
    );
    useCaseRefreshToken = new RefreshToken(
      refreshTokenRepo,
      configService,
      passwordHasher,
    );

    const userInput = {
      name: userName,
      email: userEmail,
      documentCPF: '11144477735',
      password: userPassword,
      phone: '47992000622',
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create('silver', 'PIX'),
    };
    const createdUser = await useCaseCreate.execute(userInput);
    createdUserId = createdUser.id;

    const loginInput = {
      email: userEmail,
      password: userPassword,
    };
    const loginOutput = await useCaseLogin.execute(loginInput);
    initialRefreshToken = loginOutput.refreshToken;
  });

  it('should generate new access and refresh tokens from a valid refresh token', async () => {
    const output = await useCaseRefreshToken.execute({
      refreshToken: initialRefreshToken,
    });

    expect(output).toBeDefined();
    expect(output.accessToken).toBeDefined();
    expect(output.refreshToken).toBeDefined();

    // Verify new access token
    const newAccessTokenPayload = jwt.verify(
      output.accessToken,
      configService.jwtAccessSecret,
    ) as jwt.JwtPayload;
    expect(newAccessTokenPayload.id).toBe(createdUserId);
    expect(newAccessTokenPayload.sub).toBe('accessToken');

    // Verify new refresh token
    const newRefreshTokenPayload = jwt.verify(
      output.refreshToken,
      configService.jwtRefreshSecret,
    ) as jwt.JwtPayload;
    expect(newRefreshTokenPayload.id).toBe(createdUserId);
    expect(newRefreshTokenPayload.sub).toBe('refreshToken');

    // Verify that the new refresh token was saved correctly
    const storedHashedToken = await refreshTokenRepo.getById(createdUserId);
    const isMatch = await passwordHasher.compare(
      output.refreshToken,
      storedHashedToken,
    );
    expect(isMatch).toBe(true);
  });

  it('should throw UnauthorizedError for an invalid (malformed) refresh token', async () => {
    const invalidToken = 'invalid-token';
    await expect(
      useCaseRefreshToken.execute({ refreshToken: invalidToken }),
    ).rejects.toThrow(jwt.JsonWebTokenError);
  });

  it('should throw UnauthorizedError for an expired refresh token', async () => {
    const expiredToken = jwt.sign(
      { id: createdUserId },
      configService.jwtRefreshSecret,
      { expiresIn: '0s' },
    );
    // Wait a moment to ensure the token is expired
    await new Promise((resolve) => setTimeout(resolve, 10));

    await expect(
      useCaseRefreshToken.execute({ refreshToken: expiredToken }),
    ).rejects.toThrow(jwt.TokenExpiredError);
  });

  it('should throw UnauthorizedError if token payload is a string', async () => {
    const stringPayloadToken = jwt.sign(
      'string-payload',
      configService.jwtRefreshSecret,
    );
    await expect(
      useCaseRefreshToken.execute({ refreshToken: stringPayloadToken }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if token payload has no id', async () => {
    const noIdToken = jwt.sign(
      { notId: 'some-value' },
      configService.jwtRefreshSecret,
    );
    await expect(
      useCaseRefreshToken.execute({ refreshToken: noIdToken }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError if refresh token does not match stored hash', async () => {
    // Save a wrong hash for the user
    await refreshTokenRepo.save('wrong-hash', createdUserId);

    await expect(
      useCaseRefreshToken.execute({ refreshToken: initialRefreshToken }),
    ).rejects.toThrow('Invalid Credentials.');
  });

  it('should throw NotFoundError if no refresh token is stored for the user', async () => {
    // Delete the stored token
    await refreshTokenRepo.delete(createdUserId);

    await expect(
      useCaseRefreshToken.execute({ refreshToken: initialRefreshToken }),
    ).rejects.toThrow(NotFoundError);
  });
});
