import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../../../src/application/errors/appError';
import PasswordHasher from '../../../src/application/ports/passwordHasher';
import { RefreshTokenRepository } from '../../../src/application/ports/refreshTokenRepository';
import { UserRepository } from '../../../src/application/ports/userRepository';
import { CreateUser } from '../../../src/application/usecases/createUser.usecase';
import { Login } from '../../../src/application/usecases/login.usecase';
import { Logout } from '../../../src/application/usecases/logout.usecase';
import { TrainingPlan } from '../../../src/domain/valueObjects/trainingPlan';
import { ConfigService } from '../../../src/infrastructure/config/configService';
import BcryptPasswordHasher from '../../../src/infrastructure/hashing/bcryptPasswordHasher';
import { InMemoryRefreshTokenRepository } from '../../../src/infrastructure/inMemory/inMemoryRefreshTokenRepo';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/inMemoryUserRepo';

describe('Logout usecase in-memory test', () => {
  let userRepo: UserRepository;
  let refreshTokenRepo: RefreshTokenRepository;
  let configService: ConfigService;
  let bcryptPasswordHasher: PasswordHasher;
  let logoutUseCase: Logout;
  let refreshToken: string;

  beforeAll(async () => {
    userRepo = new InMemoryUserRepo();
    refreshTokenRepo = new InMemoryRefreshTokenRepository();
    configService = new ConfigService();
    bcryptPasswordHasher = new BcryptPasswordHasher(configService.saltrounds);
    logoutUseCase = new Logout(refreshTokenRepo, configService);
    const createUserUseCase = new CreateUser(userRepo, bcryptPasswordHasher);

    const input = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      documentCPF: '11144477735',
      password: 'aVeryStrongPassword123@',
      phone: '47982000622',
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create('silver', 'PIX'),
    };

    await createUserUseCase.execute(input);

    const loginUseCase = new Login(
      userRepo,
      bcryptPasswordHasher,
      configService,
    );

    const outputLogin = await loginUseCase.execute({
      email: input.email,
      password: input.password,
    });

    refreshToken = outputLogin.refreshToken;
  });

  it('Should revoke a valid refresh token', async () => {
    await logoutUseCase.execute({ refreshToken });

    const payload = jwt.decode(refreshToken) as JwtPayload;

    if (!payload || !payload.jti) {
      throw new UnauthorizedError('JTI not found in refresh token');
    }

    expect(await refreshTokenRepo.exists(payload.jti)).toBe(true);
  });
});
