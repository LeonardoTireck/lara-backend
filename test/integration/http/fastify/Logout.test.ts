import axios, { AxiosError } from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import PasswordHasher from '../../../../src/hashing/interface/passwordHasher';
import { RefreshTokenRepository } from '../../../../src/auth/application/interface/refreshTokenRepository';
import { UserRepository } from '../../../../src/user/application/interface/userRepository';
import { CreateUser } from '../../../../src/application/usecases/createUser.usecase';
import { Login } from '../../../../src/auth/application/usecase/login.usecase';
import { container } from '../../../../src/di/inversify.config';
import { TYPES } from '../../../../src/di/types';
import { User } from '../../../../src/domain/aggregates/user';
import { TrainingPlan } from '../../../../src/domain/valueObjects/trainingPlan';
import { ConfigService } from '../../../../src/config/configService';

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

  it('should send a clearCookie header on logout', async () => {
    const response = await axios.post(
      'http://localhost:3001/v1/logout',
      {},
      {
        headers: { Cookie: `refreshToken=${refreshToken}` },
      },
    );

    expect(response.status).toBe(204);
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader![0]).toContain('refreshToken=');
    expect(setCookieHeader![0]).toContain(
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    );
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
