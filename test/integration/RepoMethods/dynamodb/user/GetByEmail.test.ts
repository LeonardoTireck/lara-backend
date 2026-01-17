import { UserRepository } from '../../../../../src/user/application/interface/userRepository';
import { container } from '../../../../../src/di/inversify.config';
import { TYPES } from '../../../../../src/di/types';
import { TrainingPlan } from '../../../../../src/user/domain/trainingPlan';
import { User } from '../../../../../src/user/domain/user';

describe('DynamoDbUserRepo - GetByEmail', () => {
  let userRepo: UserRepository;
  const user = User.create(
    'Bob Builder',
    'bob@example.com',
    '11144477735',
    '11912345678',
    new Date('1975-01-01'),
    'hashedbobpassword',
    TrainingPlan.create('silver', 'card'),
    'client',
  );

  beforeAll(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    await userRepo.save(user);
  });

  afterAll(async () => {
    await userRepo.delete(user.id);
  });

  test('should retrieve a user by email from DynamoDB', async () => {
    const retrievedUser = await userRepo.getByEmail(user.email);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toBe(user.id);
    expect(retrievedUser?.email).toBe(user.email);
  });

  test('should return undefined if user email does not exist', async () => {
    const nonExistentEmail = 'nonexistent@example.com';
    const retrievedUser = await userRepo.getByEmail(nonExistentEmail);
    expect(retrievedUser).toBeUndefined();
  });
});
