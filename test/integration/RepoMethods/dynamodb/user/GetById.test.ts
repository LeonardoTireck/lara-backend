import { UserRepository } from '../../../../../src/user/application/interface/userRepository';
import { container } from '../../../../../src/di/inversify.config';
import { TYPES } from '../../../../../src/di/types';
import { User } from '../../../../../src/domain/aggregates/user';
import { TrainingPlan } from '../../../../../src/domain/valueObjects/trainingPlan';

describe('DynamoDbUserRepo - GetById', () => {
  let userRepo: UserRepository;
  const user = User.create(
    'User from GetById Test',
    'user2@example.com',
    '11144477735',
    '11922222222',
    new Date('1991-02-02'),
    'hashedpass2',
    TrainingPlan.create('gold', 'PIX'),
    'client',
  );

  beforeAll(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    await userRepo.save(user);
  });

  afterAll(async () => {
    await userRepo.delete(user.id);
  });

  test('should retrieve a user by ID from DynamoDB', async () => {
    const retrievedUser = await userRepo.getById(user.id);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toBe(user.id);
    expect(retrievedUser?.email).toBe(user.email);
  });

  test('should return undefined if user ID does not exist', async () => {
    const nonExistentId = 'non-existent-id';
    const retrievedUser = await userRepo.getById(nonExistentId);
    expect(retrievedUser).toBeUndefined();
  });
});
