import { JwtPayload } from 'jsonwebtoken';
import PasswordHasher from '../../../../src/application/ports/PasswordHasher';
import { RefreshTokenRepository } from '../../../../src/application/ports/RefreshTokenRepository';
import { UserRepository } from '../../../../src/application/ports/UserRepository';
import { Logout } from '../../../../src/application/usecases/Logout.usecase';
import { container } from '../../../../src/di/Inversify.config';
import { TYPES } from '../../../../src/di/Types';
import { ConfigService } from '../../../../src/infrastructure/config/ConfigService';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../../../src/application/errors/AppError';
import { CreateUser } from '../../../../src/application/usecases/CreateUser.usecase';
import { Login } from '../../../../src/application/usecases/Login.usecase';
import { TrainingPlan } from '../../../../src/domain/ValueObjects/TrainingPlan';
import axios from 'axios';

describe('POST /logout route test', () => {
  let userRepo: UserRepository;
  let refreshTokenRepo: RefreshTokenRepository;
  let configService: ConfigService;
  let passwordHasher: PasswordHasher;
  let logoutUseCase: Logout;
  let name: string;
  let accessToken: JwtPayload;
  let refreshToken: JwtPayload;

  beforeAll(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    refreshTokenRepo = container.get<RefreshTokenRepository>(
      TYPES.RefreshTokenRepository,
    );
    configService = container.get<ConfigService>(TYPES.ConfigService);
    passwordHasher = container.get<PasswordHasher>(TYPES.PasswordHasher);
    logoutUseCase = container.get<Logout>(TYPES.LogoutUseCase);

    const createUserUseCase = new CreateUser(userRepo, passwordHasher);

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

    const loginUseCase = new Login(userRepo, passwordHasher, configService);

    const outputLogin = await loginUseCase.execute({
      email: input.email,
      password: input.password,
    });

    const payloadRefreshToken = jwt.verify(
      outputLogin.refreshToken,
      configService.jwtRefreshSecret,
    );

    const payloadAccessToken = jwt.verify(
      outputLogin.refreshToken,
      configService.jwtRefreshSecret,
    );
    if (typeof payloadRefreshToken === 'string') throw new UnauthorizedError();
    if (typeof payloadAccessToken === 'string') throw new UnauthorizedError();

    name = outputLogin.name;
    accessToken = payloadAccessToken;
    refreshToken = payloadRefreshToken;
  });

  it.only('Should revoke a valid refresh token by adding it to the blacklist, using axios', async () => {
    const response = await axios.post(
      'http://localhost:3001/v1/logout',
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );
    console.log(response);

    expect(response.status).toBe(200);
  });

  it('Should revoke a valid refresh token by adding it to the blacklist', async () => {
    await logoutUseCase.execute({ refreshToken });

    if (!refreshToken.jti) {
      throw new UnauthorizedError();
    }

    expect(await refreshTokenRepo.exists(refreshToken.jti)).toBe(true);
  });

  afterAll(async () => {
    let user = await userRepo.getByEmail('johndoe@email.com');
    if (user) {
      let userId = user.id;
      await userRepo.delete(userId);
    }
  });
});
