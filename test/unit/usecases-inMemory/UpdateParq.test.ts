import { BadRequestError, NotFoundError } from '../../../src/error/appError';
import { CreateUser } from '../../../src/application/usecases/createUser.usecase';
import { UpdateParq } from '../../../src/video/application/usecase/updateParq.usecase';
import { Parq } from '../../../src/domain/valueObjects/parq';
import { TrainingPlan } from '../../../src/domain/valueObjects/trainingPlan';
import BcryptPasswordHasher from '../../../src/hashing/bcryptPasswordHasher';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/inMemoryUserRepo';

describe('UpdateParq Use Case', () => {
  let repo: InMemoryUserRepo;
  let useCaseUpdateParq: UpdateParq;
  let user: { id: string };

  beforeEach(async () => {
    repo = new InMemoryUserRepo();
    const bcryptPasswordHasher = new BcryptPasswordHasher(1);
    const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
    useCaseUpdateParq = new UpdateParq(repo);

    const input = {
      name: 'Leonardo Tireck',
      email: 'leo@test.com',
      documentCPF: '11144477735',
      phone: '47992000622',
      dateOfBirth: new Date(),
      password: 'Test123@',
      activePlan: TrainingPlan.create('silver', 'PIX'),
    };
    user = await useCaseCreate.execute(input);
  });

  it("should update a user's Parq", async () => {
    const inputForParq = {
      userId: user.id,
      newParq: Parq.create(['Question1', 'Question2'], ['Answer1', 'Answer2']),
    };

    const updatedUser = await useCaseUpdateParq.execute(inputForParq);

    expect(updatedUser).toBeDefined();
    expect(updatedUser.parq).toBeDefined();
    expect(updatedUser.parq.questions).toEqual(['Question1', 'Question2']);
    expect(updatedUser.parq.answers).toEqual(['Answer1', 'Answer2']);
    const userInRepo = await repo.getById(user.id);
    expect(userInRepo?.parq).toEqual(inputForParq.newParq);
    expect(userInRepo?.lastParqUpdate).toBeInstanceOf(Date);
  });

  it('should throw an error if the user is not found', async () => {
    const inputForParq = {
      userId: 'non-existent-id',
      newParq: Parq.create(['Q'], ['A']),
    };

    await expect(useCaseUpdateParq.execute(inputForParq)).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should throw an error if newParq is null', async () => {
    const inputForParq = {
      userId: user.id,
      newParq: null as any,
    };

    await expect(useCaseUpdateParq.execute(inputForParq)).rejects.toThrow(
      BadRequestError,
    );
  });

  it('should throw an error if newParq is undefined', async () => {
    const inputForParq = {
      userId: user.id,
      newParq: undefined as any,
    };

    await expect(useCaseUpdateParq.execute(inputForParq)).rejects.toThrow(
      BadRequestError,
    );
  });
});
