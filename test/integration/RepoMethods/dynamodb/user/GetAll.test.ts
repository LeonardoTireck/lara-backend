import { UserRepository } from '../../../../../src/application/ports/UserRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';
import { User } from '../../../../../src/domain/Aggregates/User';
import { TrainingPlan } from '../../../../../src/domain/ValueObjects/TrainingPlan';

describe('DynamoDbUserRepo - GetAll', () => {
  let userRepo: UserRepository;
  const createdUsers: User[] = [];

  const testUsersData = [
    { name: 'User Alpha', cpf: '11144477735', phone: '11987654321' },
    { name: 'User Beta', cpf: '98765432100', phone: '11912345678' },
    { name: 'User Gamma', cpf: '12345678909', phone: '11988887777' },
  ];

  beforeAll(async () => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);

    for (let i = 0; i < testUsersData.length; i++) {
      const userData = testUsersData[i];
      const user = User.create(
        userData.name,
        `testuser${i}@example.com`,
        userData.cpf,
        userData.phone,
        new Date(`1990-01-0${i + 1}`),
        `hashedpass${i}`,
        TrainingPlan.create('silver', 'card'),
        'client',
      );
      await userRepo.save(user);
      createdUsers.push(user);
    }
  });

  test('should retrieve all users in pages', async () => {
    const allFetchedUsers: User[] = [];
    let lastKey;
    const pageSize = 2;

    do {
      const result = await userRepo.getAll(pageSize, lastKey);
      expect(result.users).toBeInstanceOf(Array);
      allFetchedUsers.push(...result.users);
      lastKey = result.lastEvaluatedKey?.id;
    } while (lastKey);

    expect(allFetchedUsers.length).toBeGreaterThanOrEqual(createdUsers.length);

    for (const createdUser of createdUsers) {
      expect(
        allFetchedUsers.some(
          (fetchedUser) => fetchedUser.id === createdUser.id,
        ),
      ).toBe(true);
    }
  });

  test('should retrieve the first page correctly', async () => {
    const pageSize = 1;
    const result = await userRepo.getAll(pageSize);

    expect(result.users.length).toBe(pageSize);
    expect(result.lastEvaluatedKey).toBeDefined();
  });
});
