import { UserRepository } from '../../../../../src/user/application/interface/userRepository';
import { container } from '../../../../../src/di/inversify.config';
import { TYPES } from '../../../../../src/di/types';
import { User } from '../../../../../src/domain/aggregates/user';
import { TrainingPlan } from '../../../../../src/domain/valueObjects/trainingPlan';

describe('DynamoDbUserRepo', () => {
  let userRepo: UserRepository;
  let user: User;

  beforeAll(() => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
    const mockTrainingPlan = TrainingPlan.create('silver', 'card');
    user = User.create(
      'John Doe',
      'johndoe@example.com',
      '11144477735',
      '11987654321',
      new Date('1990-01-01'),
      'hashedpassword123',
      mockTrainingPlan,
      'client',
    );
  });

  afterAll(async () => {
    if (user) {
      await userRepo.delete(user.id);
    }
  });

  test('should save a user to DynamoDB', async () => {
    await userRepo.save(user);
    const retrievedUser = await userRepo.getById(user.id);
    expect(retrievedUser).toBeDefined();
  });
});
