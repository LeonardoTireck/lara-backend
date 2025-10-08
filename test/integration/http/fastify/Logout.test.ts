import axios, { AxiosError } from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import PasswordHasher from '../../../../src/application/ports/PasswordHasher';
import { RefreshTokenRepository } from '../../../../src/application/ports/RefreshTokenRepository';
import { UserRepository } from '../../../../src/application/ports/UserRepository';
import { CreateUser } from '../../../../src/application/usecases/CreateUser.usecase';
import { Login } from '../../../../src/application/usecases/Login.usecase';
import { cleanupExpiredToken } from '../../../../src/cli/CleanupExpiredTokens';
import { container } from '../../../../src/di/Inversify.config';
import { TYPES } from '../../../../src/di/Types';
import { User } from '../../../../src/domain/Aggregates/User';
import { TrainingPlan } from '../../../../src/domain/ValueObjects/TrainingPlan';
import { ConfigService } from '../../../../src/infrastructure/config/ConfigService';

describe('POST /logout route test', () => {
  let userRepo: UserRepository;
  let refreshTokenRepo: RefreshTokenRepository;
  let configService: ConfigService;
  let passwordHasher: PasswordHasher;
  let user: User;
  let refreshToken: string;

  beforeEach(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
    configService = container.get<ConfigService>(TYPES.ConfigService);
    passwordHasher = container.get<PasswordHasher>(TYPES.PasswordHasher);

    const createUserUseCase = new CreateUser(userRepo, passwordHasher);
    const userInput = {
      name: 'Test User',
      email: 'test.user@email.com',
      documentCPF: '11144477735',
      password: 'aVeryStrongPassword123@',
      phone: '1234567890',
      dateOfBirth: new Date('1990-01-01'),
      activePlan: TrainingPlan.create('silver', 'PIX'),
    };
    const createdUserOutput = await createUserUseCase.execute(userInput);
    const foundUser = await userRepo.getById(createdUserOutput.id);
    if (!foundUser) {
      throw new Error('Test setup failed: could not find created user');
    }
    user = foundUser;

    const loginUseCase = new Login(userRepo, passwordHasher, configService);
    const loginOutput = await loginUseCase.execute({
      email: userInput.email,
      password: userInput.password,
    });
    refreshToken = loginOutput.refreshToken;
  });

  afterEach(async () => {
    if (user) {
      await userRepo.delete(user.id);
    }
    await cleanupExpiredToken();
  });

  it('should successfully logout and revoke the refresh token', async () => {
    const response = await axios.post(
      'http://localhost:3001/v1/logout',
      {},
      {
        headers: { Cookie: `refreshToken=${refreshToken}` },
      },
    );

    expect(response.status).toBe(204);

    const payload = jwt.decode(refreshToken) as JwtPayload;
    expect(payload.jti).toBeDefined();
    const isRevoked = await refreshTokenRepo.exists(payload.jti!);
    expect(isRevoked).toBe(true);
  });

  it('should fail to logout if the token is already revoked', async () => {
    await axios.post(
      'http://localhost:3001/v1/logout',
      {},
      {
        headers: { Cookie: `refreshToken=${refreshToken}` },
      },
    );

    try {
      await axios.post(
        'http://localhost:3001/v1/logout',
        {},
        {
          headers: { Cookie: `refreshToken=${refreshToken}` },
        },
      );
      fail('The second logout should have failed');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response).toBeDefined();
      expect(axiosError.response?.status).toBe(401);
    }
  });

  it('should fail to logout if the token is invalid', async () => {
    const invalidToken = 'this-is-not-a-valid-jwt';
    try {
      await axios.post(
        'http://localhost:3001/v1/logout',
        {},
        {
          headers: { Cookie: `refreshToken=${invalidToken}` },
        },
      );
      fail('Logout with an invalid token should have failed');
    } catch (error) {
      const axiosError = error as AxiosError;
      expect(axiosError.response).toBeDefined();
      expect(axiosError.response?.status).toBe(401);
    }
  });
});

