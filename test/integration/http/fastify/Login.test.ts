import axios from 'axios';
import { UserRepository } from '../../../../src/user/application/interface/userRepository';
import { CreateUser } from '../../../../src/application/usecases/createUser.usecase';
import { container } from '../../../../src/di/inversify.config';
import { TYPES } from '../../../../src/di/types';

describe('Test for the /login route', () => {
  let userRepo: UserRepository;
  let createUserUseCase: CreateUser;
  const testUserEmail = 'login.test@example.com';

  beforeAll(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    createUserUseCase = container.get<CreateUser>(TYPES.CreateUserUseCase);

    const user = {
      name: 'John Doe',
      email: testUserEmail,
      password: 'Test123@',
      documentCPF: '11144477735',
      phone: '11987654321',
      dateOfBirth: new Date('1990-01-04'),
      activePlan: {
        planType: 'silver',
        paymentMethod: 'PIX',
      },
    } as const;
    await createUserUseCase.execute(user);
  });

  afterAll(async () => {
    const user = await userRepo.getByEmail(testUserEmail);
    if (user) {
      await userRepo.delete(user.id);
    }
  });

  it('Should login and return user name, access token, and a refreshToken cookie', async () => {
    const input = {
      email: testUserEmail,
      password: 'Test123@',
    };

    const outputHttpLogin = await axios.post(
      'http://localhost:3001/v1/login',
      input,
    );

    expect(outputHttpLogin.data).toBeDefined();
    expect(outputHttpLogin.data.name).toBe('John Doe');
    expect(outputHttpLogin.data.accessToken).toBeDefined();
    expect(outputHttpLogin.data.refreshToken).toBeUndefined();

    const setCookieHeader = outputHttpLogin.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader![0]).toContain('refreshToken=');
    expect(setCookieHeader![0]).toContain('HttpOnly');
  });
});
