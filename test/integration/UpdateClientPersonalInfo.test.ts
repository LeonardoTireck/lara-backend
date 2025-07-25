import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { FindUserById } from "../../src/application/usecases/FindUserById.usecase";
import { UpdateClientPersonalInfo } from "../../src/application/usecases/UpdateClientPersonalInfo.usecase";
import { TrainingPlan } from "../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should update a user email, password and phone", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

  const input = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    password: "Test123@",
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;

  const user = await useCaseCreate.execute(input);
  const useCaseUpdateClientPersonalInfo = new UpdateClientPersonalInfo(
    repo,
    bcryptPasswordHasher,
  );
  const inputForUpdate = {
    id: user.id,
    email: "leo2@test2.com",
    phone: "+5547991079000",
    plainTextPassword: "123Test@",
  };
  await useCaseUpdateClientPersonalInfo.execute(inputForUpdate);

  const findUserByIdUseCase = new FindUserById(repo);
  const updatedUser = await findUserByIdUseCase.execute({ userId: user.id });

  expect(updatedUser.email).toBe(inputForUpdate.email);
  expect(updatedUser.phone).toBe(inputForUpdate.phone);
  expect(
    await bcryptPasswordHasher.compare(
      inputForUpdate.plainTextPassword,
      updatedUser.password,
    ),
  ).toBe(true);
});
