import { CreateUser } from '../../../src/application/usecases/CreateUser.usecase';
import { FindUserById } from '../../../src/application/usecases/FindUserById.usecase';
import { TrainingPlan } from '../../../src/domain/TrainingPlan';
import BcryptPasswordHasher from '../../../src/infrastructure/hashing/BcryptPasswordHasher';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/InMemoryUserRepo';

describe('FindUserById Use Case', () => {
    let repo: InMemoryUserRepo;
    let useCaseFind: FindUserById;
    let userCreatedId: string;

    beforeEach(async () => {
        repo = new InMemoryUserRepo();
        useCaseFind = new FindUserById(repo);

        const bcryptPasswordHasher = new BcryptPasswordHasher(1);
        const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
        const inputForCreation = {
            name: 'Leonardo Tireck',
            email: 'leo@test.com',
            documentCPF: '11144477735',
            password: 'Test123@',
            phone: '47992000622',
            dateOfBirth: new Date('1990-01-01'),
            activePlan: TrainingPlan.create('silver', 'PIX'),
        };
        const userCreated = await useCaseCreate.execute(inputForCreation);
        userCreatedId = userCreated.id;
    });

    it('should find a user by id and return all its properties', async () => {
        const input = {
            userId: userCreatedId,
        };

        const user = await useCaseFind.execute(input);

        expect(user.id).toBe(userCreatedId);
        expect(user.name).toBe('Leonardo Tireck');
        expect(user.email).toBe('leo@test.com');
        expect(user.documentCPF).toBe('11144477735');
        expect(user.phone).toBe('47992000622');
        expect(user.dateOfBirth.toISOString()).toContain('1990-01-01');
        expect(user.userType).toBe('client');
        expect(user.activePlan?.planType).toBe('silver');
        expect(user.pastPlans).toEqual([]);
        expect(user.trainingSessions).toEqual([]);
        expect(user.parq).toBeUndefined();
    });

    it('should throw an error if user is not found', async () => {
        const input = {
            userId: 'non-existent-id',
        };

        await expect(useCaseFind.execute(input)).rejects.toThrow(
            'User not found.',
        );
    });

    it('should throw an error if user ID is empty', async () => {
        const input = {
            userId: '',
        };

        await expect(useCaseFind.execute(input)).rejects.toThrow(
            'User not found.',
        );
    });
});
