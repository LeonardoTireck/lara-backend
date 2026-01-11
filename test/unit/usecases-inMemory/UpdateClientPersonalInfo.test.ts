import {
  NotFoundError,
  ValidationError,
} from '../../../src/application/errors/appError';
import { CreateUser } from '../../../src/application/usecases/createUser.usecase';
import { GetUserById } from '../../../src/application/usecases/getUserById.usecase';
import { UpdateClientPersonalInfo } from '../../../src/application/usecases/updateClientPersonalInfo.usecase';
import { TrainingPlan } from '../../../src/domain/valueObjects/trainingPlan';
import BcryptPasswordHasher from '../../../src/infrastructure/hashing/bcryptPasswordHasher';
import { InMemoryUserRepo } from '../../../src/infrastructure/inMemory/inMemoryUserRepo';

describe('UpdateClientPersonalInfo Use Case', () => {
  let repo: InMemoryUserRepo;
  let bcryptPasswordHasher: BcryptPasswordHasher;
  let useCaseCreate: CreateUser;
  let useCaseUpdateClientPersonalInfo: UpdateClientPersonalInfo;
  let user: { id: string };

  beforeEach(async () => {
    repo = new InMemoryUserRepo();
    bcryptPasswordHasher = new BcryptPasswordHasher(1);
    useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
    useCaseUpdateClientPersonalInfo = new UpdateClientPersonalInfo(
      repo,
      bcryptPasswordHasher,
    );

    const input = {
      name: 'Leonardo Tireck',
      email: 'leo@test.com',
      documentCPF: '98765432100',
      phone: '47992000622',
      dateOfBirth: new Date(),
      password: 'Test123@',
      activePlan: TrainingPlan.create('silver', 'PIX'),
    };
    user = await useCaseCreate.execute(input);
  });

  it('should update a user email, password and phone', async () => {
    const inputForUpdate = {
      id: user.id,
      email: 'leo2@test2.com',
      phone: '47991079000',
      plainTextPassword: '123Test@',
    };
    await useCaseUpdateClientPersonalInfo.execute(inputForUpdate);

    const findUserByIdUseCase = new GetUserById(repo);
    const updatedUser = await findUserByIdUseCase.execute({
      userId: user.id,
    });

    expect(updatedUser.email).toBe(inputForUpdate.email);
    expect(updatedUser.phone).toBe(inputForUpdate.phone);
    expect(
      await bcryptPasswordHasher.compare(
        inputForUpdate.plainTextPassword!,
        updatedUser.password,
      ),
    ).toBe(true);
  });

  it("should update only the user's email", async () => {
    const originalUser = await repo.getById(user.id);
    const inputForUpdate = {
      id: user.id,
      email: 'new.email@test.com',
    };
    await useCaseUpdateClientPersonalInfo.execute(inputForUpdate);

    const findUserByIdUseCase = new GetUserById(repo);
    const updatedUser = await findUserByIdUseCase.execute({
      userId: user.id,
    });

    expect(updatedUser.email).toBe(inputForUpdate.email);
    expect(updatedUser.phone).toBe(originalUser?.phone);
    expect(updatedUser.password).toBe(originalUser?.hashedPassword);
  });

  it("should update only the user's phone", async () => {
    const originalUser = await repo.getById(user.id);
    const inputForUpdate = {
      id: user.id,
      phone: '47998887777',
    };
    await useCaseUpdateClientPersonalInfo.execute(inputForUpdate);

    const findUserByIdUseCase = new GetUserById(repo);
    const updatedUser = await findUserByIdUseCase.execute({
      userId: user.id,
    });

    expect(updatedUser.email).toBe(originalUser?.email);
    expect(updatedUser.phone).toBe(inputForUpdate.phone);
    expect(updatedUser.password).toBe(originalUser?.hashedPassword);
  });

  it("should update only the user's password", async () => {
    const originalUser = await repo.getById(user.id);
    const inputForUpdate = {
      id: user.id,
      plainTextPassword: 'NewSecurePass1!',
    };
    await useCaseUpdateClientPersonalInfo.execute(inputForUpdate);

    const findUserByIdUseCase = new GetUserById(repo);
    const updatedUser = await findUserByIdUseCase.execute({
      userId: user.id,
    });

    expect(updatedUser.email).toBe(originalUser?.email);
    expect(updatedUser.phone).toBe(originalUser?.phone);
    expect(
      await bcryptPasswordHasher.compare(
        inputForUpdate.plainTextPassword!,
        updatedUser.password,
      ),
    ).toBe(true);
  });

  it('should not change user info if no update fields are provided', async () => {
    const originalUser = await repo.getById(user.id);
    const inputForUpdate = {
      id: user.id,
    };
    await useCaseUpdateClientPersonalInfo.execute(inputForUpdate);

    const findUserByIdUseCase = new GetUserById(repo);
    const updatedUser = await findUserByIdUseCase.execute({
      userId: user.id,
    });

    expect(updatedUser.email).toBe(originalUser?.email);
    expect(updatedUser.phone).toBe(originalUser?.phone);
    expect(updatedUser.password).toBe(originalUser?.hashedPassword);
  });

  it('should throw an error if the user is not found', async () => {
    const inputForUpdate = {
      id: 'non-existent-id',
      email: 'nonexistent@test.com',
    };
    await expect(
      useCaseUpdateClientPersonalInfo.execute(inputForUpdate),
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw an error for invalid email format', async () => {
    const inputForUpdate = {
      id: user.id,
      email: 'invalid-email-format',
    };
    await expect(
      useCaseUpdateClientPersonalInfo.execute(inputForUpdate),
    ).rejects.toThrow(ValidationError);
  });

  it('should throw an error for invalid phone format', async () => {
    const inputForUpdate = {
      id: user.id,
      phone: '123',
    };
    await expect(
      useCaseUpdateClientPersonalInfo.execute(inputForUpdate),
    ).rejects.toThrow(ValidationError);
  });

  it('should throw an error for invalid password format', async () => {
    const inputForUpdate = {
      id: user.id,
      plainTextPassword: 'short',
    };
    await expect(
      useCaseUpdateClientPersonalInfo.execute(inputForUpdate),
    ).rejects.toThrow(ValidationError);
  });
});
