import { TrainingPlan } from '../../../../src/domain/TrainingPlan';
import { User } from '../../../../src/domain/User';
import { DynamoDbUserRepo } from '../../../../src/infrastructure/dynamodb/repos/UserRepo';

describe('DynamoDbUserRepo - GetById', () => {
    let userRepo: DynamoDbUserRepo;

    beforeAll(() => {
        userRepo = new DynamoDbUserRepo();
    });

    test('should retrieve a user by ID from DynamoDB', async () => {
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

        await userRepo.save(user);

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
