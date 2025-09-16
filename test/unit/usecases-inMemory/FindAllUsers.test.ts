import {
  FindAllUsers,
  FindAllUsersInput,
} from '../../../src/application/usecases/FindAllUsers.usecase';
import { User } from '../../../src/domain/Aggregates/User';
import { TrainingPlan } from '../../../src/domain/ValueObjects/TrainingPlan';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/InMemoryUserRepo';

describe('FindAllUsers Use Case Test', () => {
  let repo: InMemoryUserRepo;
  let useCaseFindAllUsers: FindAllUsers;

  const testUsersData = [
    { name: 'User Alpha', cpf: '11144477735', phone: '11987654321' },
    { name: 'User Beta', cpf: '98765432100', phone: '11912345678' },
    { name: 'User Gamma', cpf: '12345678909', phone: '11988887777' },
  ];

  beforeEach(async () => {
    repo = new InMemoryUserRepo();
    useCaseFindAllUsers = new FindAllUsers(repo);

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
      await repo.save(user);
    }
  });

  it('should return the first page of users', async () => {
    const input: FindAllUsersInput = { limit: 2 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(2);
    expect(output.users[0].name).toBe('User Alpha');
    expect(output.users[0].email).toBe('testuser0@example.com');
    expect(output.users[1].name).toBe('User Beta');
    expect(output.users[1].email).toBe('testuser1@example.com');
    expect(output.lastEvaluatedKey).toBeDefined();
  });

  it('should return the second page of users', async () => {
    // First, get the first page to obtain the lastEvaluatedKey
    const firstPageInput: FindAllUsersInput = { limit: 2 };
    const firstPageOutput = await useCaseFindAllUsers.execute(firstPageInput);

    expect(firstPageOutput.users).toHaveLength(2);
    expect(firstPageOutput.lastEvaluatedKey).toBeDefined();
    const lastEvaluatedId = firstPageOutput.lastEvaluatedKey?.id;

    // Now, request the second page using the lastEvaluatedId
    const secondPageInput: FindAllUsersInput = {
      limit: 2,
      exclusiveStartKey: lastEvaluatedId,
    };
    const secondPageOutput = await useCaseFindAllUsers.execute(secondPageInput);

    expect(secondPageOutput.users).toHaveLength(1);
    expect(secondPageOutput.users[0].name).toBe('User Gamma');
    expect(secondPageOutput.users[0].email).toBe('testuser2@example.com');
    expect(secondPageOutput.lastEvaluatedKey).toBeUndefined();
  });

  it('should return an empty array when the repository is empty', async () => {
    repo.users = []; // Clear the repository
    const input: FindAllUsersInput = { limit: 5 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(0);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it('should return all users when limit is greater than total users', async () => {
    const input: FindAllUsersInput = { limit: 10 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(testUsersData.length);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it('should return an empty array when limit is 0', async () => {
    const input: FindAllUsersInput = { limit: 0 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(0);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });

  it('should return an empty array when limit is negative', async () => {
    const input: FindAllUsersInput = { limit: -1 };
    const output = await useCaseFindAllUsers.execute(input);

    expect(output.users).toHaveLength(0);
    expect(output.lastEvaluatedKey).toBeUndefined();
  });
});
