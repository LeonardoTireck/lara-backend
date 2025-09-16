import axios from 'axios';
import { UserRepository } from '../../../../src/application/ports/UserRepository';
import { container } from '../../../../src/di/Inversify.config';
import { TYPES } from '../../../../src/di/Types';

describe('Create user route Test', () => {
  const input = {
    name: 'Leonardo Tireck',
    email: 'leo3@test.com',
    documentCPF: '987.654.321-00',
    phone: '+5547992000622',
    dateOfBirth: new Date(),
    password: 'Test123@',
    activePlan: {
      planType: 'silver',
      paymentMethod: 'card',
    },
  } as const;

  afterAll(async () => {
    const userRepo = container.get<UserRepository>(TYPES.UserRepository);
    const user = await userRepo.getByEmail(input.email);
    if (user) {
      await userRepo.delete(user.id);
    }
  });

  test('Should create a user using express and dynamodb', async () => {
    const outputHttpCreateUser = await axios.post(
      'http://localhost:3001/v1/newUser',
      input,
    );
    expect(outputHttpCreateUser.data.name).toBe(input.name);
    expect(outputHttpCreateUser.data.email).toBe(input.email);
  });
});
