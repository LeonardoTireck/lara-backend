import { UserRepository } from '../../../../src/application/ports/UserRepository';
import { container } from '../../../../src/di/Inversify.config';
import { TYPES } from '../../../../src/di/Types';
import { TrainingPlan } from '../../../../src/domain/TrainingPlan';
import { User } from '../../../../src/domain/User';

describe('DynamoDbUserRepo', () => {
    let userRepo: UserRepository;

    beforeAll(() => {
        userRepo = container.get<UserRepository>(TYPES.UserRepository);
    });

    test('should save a user to DynamoDB', async () => {
        const mockTrainingPlan = TrainingPlan.create('silver', 'card');
        const user = User.create(
            'John Doe',
            'johndoe@example.com',
            '11144477735',
            '11987654321',
            new Date('1990-01-01'),
            'hashedpassword123',
            mockTrainingPlan,
            'client',
        );

        expect(await userRepo.save(user)).resolves;
    });
});
