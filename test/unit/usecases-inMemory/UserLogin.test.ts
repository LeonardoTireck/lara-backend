import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../src/application/errors/AppError';
import { CreateUser } from '../../../src/application/usecases/CreateUser.usecase';
import { UserLogin } from '../../../src/application/usecases/UserLogin.usecase';
import { TrainingPlan } from '../../../src/domain/ValueObjects/TrainingPlan';
import { ConfigService } from '../../../src/infrastructure/config/ConfigService';
import BcryptPasswordHasher from '../../../src/infrastructure/hashing/BcryptPasswordHasher';
import { InMemoryRefreshTokenRepository } from '../../../src/infrastructure/inMemory/inMemoryRefreshTokenRepo';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/InMemoryUserRepo';

describe('UserLogin Use Case', () => {
  let userRepo: InMemoryUserRepo;
  let refreshTokensRepo: InMemoryRefreshTokenRepository;
  let configService: ConfigService;
  let bcryptPasswordHasher: BcryptPasswordHasher;
  let useCaseLogin: UserLogin;
  let createdUserId: string;

  const userEmail = 'leo@test.com';
  const userPassword = 'Test123@';
  const userName = 'Leonardo Tireck';

  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  beforeEach(async () => {
    userRepo = new InMemoryUserRepo();
    refreshTokensRepo = new InMemoryRefreshTokenRepository();
    configService = new ConfigService();
    bcryptPasswordHasher = new BcryptPasswordHasher(1);
    configService = new ConfigService();
    useCaseLogin = new UserLogin(
      userRepo,
      refreshTokensRepo,
      bcryptPasswordHasher,
      configService,
    );
    const useCaseCreate = new CreateUser(userRepo, bcryptPasswordHasher);

    const input = {
      name: userName,
      email: userEmail,
      documentCPF: '11144477735',
      password: userPassword,
      phone: '47992000622',
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create('silver', 'PIX'),
    };
    const createdUser = await useCaseCreate.execute(input);
    createdUserId = createdUser.id;
  });

  it('should login by email, verify the password match and return a JWT', async () => {
    const input = {
      email: userEmail,
      password: userPassword,
    };
    const output = await useCaseLogin.execute(input);
    expect(output).toBeDefined();
    expect(output?.accessToken).toBeDefined();

    const tokenPayload = jwt.verify(
      output!.accessToken,
      configService.jwtAccessSecret,
    ) as jwt.JwtPayload;
    expect(tokenPayload.id).toBe(createdUserId);
    expect(tokenPayload.exp).toBeDefined();
    expect(tokenPayload.iat).toBeDefined();
  });

  it('should fail to login with an incorrect password', async () => {
    const input = {
      email: userEmail,
      password: 'wrongpassword',
    };
    await expect(useCaseLogin.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('should fail to login with a non-existent email', async () => {
    const input = {
      email: 'nonexistent@test.com',
      password: userPassword,
    };
    await expect(useCaseLogin.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('should fail to login with an invalid email format', async () => {
    const input = {
      email: 'invalid-email-format',
      password: userPassword,
    };
    await expect(useCaseLogin.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );
  });

  it('should fail to login with an empty password', async () => {
    const input = {
      email: userEmail,
      password: '',
    };
    await expect(useCaseLogin.execute(input)).rejects.toThrow(
      UnauthorizedError,
    );
  });
});
