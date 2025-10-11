import { UserRepository } from '../../../../../src/application/ports/UserRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';
import { User } from '../../../../../src/domain/Aggregates/User';
import { TrainingPlan } from '../../../../../src/domain/ValueObjects/TrainingPlan';

describe('DynamoDbUserRepo - Delete', () => {
  let userRepo: UserRepository;
  const user = User.create(
    'Charlie Chaplin',
    'charlie@example.com',
    '11144477735',
    '11933334444',
    new Date('1960-03-03'),
    'hashedcharliepassword',
    TrainingPlan.create('silver', 'card'),
    'client',
  );

  beforeAll(() => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
  });

  afterAll(async () => {
    await userRepo.delete(user.id).catch(() => {      /* Do nothing on failure, as the user may have been deleted in the test */
});
  });

  test('should delete a user from DynamoDB', async () => {
    await userRepo.save(user);
    await userRepo.delete(user.id);

    const retrievedUser = await userRepo.getById(user.id);
    expect(retrievedUser).toBeUndefined();
  });

  test('should return an error if user ID to delete does not exist', async () => {
    const nonExistentId = 'non-existent-delete-id';
    await expect(userRepo.delete(nonExistentId)).rejects.toThrow(nonExistentId);
  });
});
