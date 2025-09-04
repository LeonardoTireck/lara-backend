import { TrainingPlan } from '../../../../src/domain/TrainingPlan';
import { User } from '../../../../src/domain/User';
import { DynamoDbUserRepo } from '../../../../src/infrastructure/dynamodb/repos/UserRepo';

describe('DynamoDbUserRepo - GetByEmail', () => {
    let userRepo: DynamoDbUserRepo;

    beforeAll(() => {
        userRepo = new DynamoDbUserRepo();
    });

    test('should retrieve a user by email from DynamoDB', async () => {
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

        await userRepo.save(user);

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
