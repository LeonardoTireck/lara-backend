import { UserRepository } from '../../../../../src/application/ports/UserRepository';
import { container } from '../../../../../src/di/Inversify.config';
import { TYPES } from '../../../../../src/di/Types';
import { User } from '../../../../../src/domain/Aggregates/User';
import { Parq } from '../../../../../src/domain/ValueObjects/Parq';
import { TrainingPlan } from '../../../../../src/domain/ValueObjects/TrainingPlan';

describe('DynamoDbUserRepo - Update', () => {
  let userRepo: UserRepository;
  let user: User;

  beforeAll(() => {
    userRepo = container.get<UserRepository>(TYPES.UserRepository);
  });

  afterAll(async () => {
    if (user) {
      try {
        await userRepo.delete(user.id);
      } catch (error) {
        console.error(error);
      }
    }
  });

  test('should update all user fields in DynamoDB', async () => {
    user = User.create(
      'Jane Doe',
      'janedoe@example.com',
      '11144477735',
      '11987654321',
      new Date('1995-05-05'),
      'initialhashedpassword',
      TrainingPlan.create('silver', 'card'),
      'client',
    );

    await userRepo.save(user);

    const updatedPhone = '48999999999';
    const updatedEmail = 'janesmith@example.com';
    const newPassword = 'newhashedpassword';
    const newPlan = TrainingPlan.create('gold', 'PIX');
    const newParq = Parq.create(['question1'], ['answer1']);

    user.updatePhone(updatedPhone);
    user.updateEmail(updatedEmail);
    user.updatePassword(newPassword);
    user.updateActivePlan(newPlan);
    user.updateParq(newParq);

    await userRepo.update(user);

    const retrievedUser = await userRepo.getById(user.id);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.phone).toBe(updatedPhone);
    expect(retrievedUser?.email).toBe(updatedEmail);
    expect(retrievedUser?.hashedPassword).toBe(newPassword);
    expect(retrievedUser?.activePlan?.planType).toBe('gold');
    expect(retrievedUser?.parq?.questions[0]).toBe('question1');
    expect(retrievedUser?.lastParqUpdate).toBeDefined();
  });
});
