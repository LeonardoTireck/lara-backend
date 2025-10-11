import axios from 'axios';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../../src/application/ports/UserRepository';
import { CreateUser } from '../../../../src/application/usecases/CreateUser.usecase';
import { Login } from '../../../../src/application/usecases/Login.usecase';
import { container } from '../../../../src/di/Inversify.config';
import { TYPES } from '../../../../src/di/Types';

describe('Test for the /refresh route', () => {
  let userRepo: UserRepository;
  let createUserUseCase: CreateUser;
  let loginUseCase: Login;
  const testUserEmail = 'refresh.test@example.com';
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    createUserUseCase = container.get<CreateUser>(TYPES.CreateUserUseCase);
    loginUseCase = container.get<Login>(TYPES.LoginUseCase);

    const user = {
      name: 'John Doe Refresh',
      email: testUserEmail,
      password: 'Test123@',
      documentCPF: '11144477735',
      phone: '11987654323',
      dateOfBirth: new Date('1990-01-06'),
      activePlan: {
        planType: 'silver',
        paymentMethod: 'PIX',
      },
    } as const;
    const createdUser = await createUserUseCase.execute(user);
    userId = createdUser.id;

    const loginOutput = await loginUseCase.execute({
      email: user.email,
      password: user.password,
    });
    refreshToken = loginOutput.refreshToken;
  });

  afterAll(async () => {
    const user = await userRepo.getByEmail(testUserEmail);
    if (user) {
      await userRepo.delete(user.id);
    }
  });

  it('Should send a valid refresh token and retrieve new access and refresh tokens', async () => {
    const response = await axios.post(
      'http://localhost:3001/v1/refresh',
      {},
      {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      },
    );

    expect(response.status).toBe(200);
    expect(response.data.accessToken).toBeDefined();

    const newAccessToken = response.data.accessToken;
    const decodedToken = jwt.decode(newAccessToken) as {
      id: string;
      userType: string;
    };
    expect(decodedToken.id).toBe(userId);
    expect(decodedToken.userType).toBe('client');

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader![0]).toContain('refreshToken=');
    expect(setCookieHeader![0]).toContain('HttpOnly');

    const newRefreshToken = setCookieHeader![0].split(';')[0].split('=')[1];
    expect(newRefreshToken).not.toBe(refreshToken);
  });
});
