import { CreateUser } from '../../../../src/application/usecases/CreateUser.usecase';
import { TrainingPlan } from '../../../../src/domain/TrainingPlan';
import BcryptPasswordHasher from '../../../../src/infrastructure/Hashing/BcryptPasswordHasher';
import { InMemoryUserRepo } from '../../../../src/infrastructure/inMemory/InMemoryUserRepo';

describe('InMemoryUserRepo Delete Method', () => {
    let repo: InMemoryUserRepo;

    beforeEach(() => {
        repo = new InMemoryUserRepo();
    });

    it('should delete a user successfully', async () => {
        const bcryptPasswordHasher = new BcryptPasswordHasher(1);
        const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
        const inputForCreation = {
            name: 'Leonardo Tireck',
            email: 'leo@test.com',
            documentCPF: '11144477735',
            password: 'Test123@',
            phone: '47992000622',
            dateOfBirth: new Date(),
            activePlan: TrainingPlan.create('silver', 'PIX'),
        };
        const userCreated = await useCaseCreate.execute(inputForCreation);

        await repo.delete(userCreated.id);

        expect(repo.users).toHaveLength(0);
        const deletedUser = await repo.getById(userCreated.id);
        expect(deletedUser).toBeUndefined();
    });

    it('should throw an error if user ID to delete does not exist', async () => {
        const nonExistentId = 'non-existent-delete-id';
        await expect(repo.delete(nonExistentId)).rejects.toThrow(
            'User not found.',
        );
    });

    it('should throw an error if user ID is empty', async () => {
        const emptyId = '';
        await expect(repo.delete(emptyId)).rejects.toThrow('User not found.');
    });
});
