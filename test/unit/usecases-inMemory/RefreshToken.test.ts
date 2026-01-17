import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../src/error/appError';
import { CreateUser } from '../../../src/application/usecases/createUser.usecase';
import { Login } from '../../../src/auth/application/usecase/login.usecase';
import { RefreshToken } from '../../../src/auth/application/usecase/refreshToken.usecase';
import { TrainingPlan } from '../../../src/domain/valueObjects/trainingPlan';
import { ConfigService } from '../../../src/config/configService';
import BcryptPasswordHasher from '../../../src/hashing/bcryptPasswordHasher';
import { InMemoryRefreshTokenRepository } from '../../../src/infrastructure/inMemory/inMemoryRefreshTokenRepo';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/inMemoryUserRepo';

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

    process.env.JWT_SECRET = 'test_access_secret';
    process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
    configService = new ConfigService();

    const useCaseCreate = new CreateUser(userRepo, passwordHasher);
    useCaseLogin = new Login(userRepo, passwordHasher, configService);
    useCaseRefreshToken = new RefreshToken(refreshTokenRepo, configService);

    const userInput = {
      name: userName,
      email: userEmail,
      documentCPF: '11144477735',
      password: userPassword,
      phone: '41992000622',
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

    const newAccessTokenPayload = jwt.verify(
      output.accessToken,
      configService.jwtAccessSecret,
    ) as jwt.JwtPayload;
    expect(newAccessTokenPayload.id).toBe(createdUserId);
    expect(newAccessTokenPayload.sub).toBe('accessToken');

    const newRefreshTokenPayload = jwt.verify(
      output.refreshToken,
      configService.jwtRefreshSecret,
    ) as jwt.JwtPayload;
    expect(newRefreshTokenPayload.id).toBe(createdUserId);
    expect(newRefreshTokenPayload.sub).toBe('refreshToken');
  });

  it('should throw UnauthorizedError for an invalid (malformed) refresh token', async () => {
    const invalidToken = 'invalid-token';
    await expect(
      useCaseRefreshToken.execute({ refreshToken: invalidToken }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw UnauthorizedError for an expired refresh token', async () => {
    const expiredToken = jwt.sign(
      { id: createdUserId },
      configService.jwtRefreshSecret,
      { expiresIn: '0s' },
    );
    await new Promise((resolve) => setTimeout(resolve, 10));

    await expect(
      useCaseRefreshToken.execute({ refreshToken: expiredToken }),
    ).rejects.toThrow(UnauthorizedError);
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
});
