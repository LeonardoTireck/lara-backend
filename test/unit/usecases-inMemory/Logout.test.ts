import jwt, { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from '../../../src/application/errors/AppError';
import PasswordHasher from '../../../src/application/ports/PasswordHasher';
import { RefreshTokenRepository } from '../../../src/application/ports/RefreshTokenRepository';
import { UserRepository } from '../../../src/application/ports/UserRepository';
import { CreateUser } from '../../../src/application/usecases/CreateUser.usecase';
import { Login } from '../../../src/application/usecases/Login.usecase';
import { Logout } from '../../../src/application/usecases/Logout.usecase';
import { TrainingPlan } from '../../../src/domain/ValueObjects/TrainingPlan';
import { ConfigService } from '../../../src/infrastructure/config/ConfigService';
import BcryptPasswordHasher from '../../../src/infrastructure/hashing/BcryptPasswordHasher';
import { InMemoryRefreshTokenRepository } from '../../../src/infrastructure/inMemory/inMemoryRefreshTokenRepo';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/InMemoryUserRepo';

describe('Logout usecase in-memory test', () => {
  let userRepo: UserRepository;
  let refreshTokenRepo: RefreshTokenRepository;
  let configService: ConfigService;
  let bcryptPasswordHasher: PasswordHasher;
  let logoutUseCase: Logout;
  let name: string;
  let accessToken: string;
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

    name = outputLogin.name;
    accessToken = outputLogin.accessToken;
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