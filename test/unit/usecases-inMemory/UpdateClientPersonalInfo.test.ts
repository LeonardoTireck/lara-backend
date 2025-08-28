import { CreateUser } from "../../../src/application/usecases/CreateUser.usecase";
import { FindUserById } from "../../../src/application/usecases/FindUserById.usecase";
import { UpdateClientPersonalInfo } from "../../../src/application/usecases/UpdateClientPersonalInfo.usecase";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

describe("UpdateClientPersonalInfo Integration Test", () => {
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
      name: "Leonardo Tireck",
      email: "leo@test.com",
      documentCPF: "98765432100", // Adjusted to be a valid CPF for the domain object
      phone: "47992000622", // Adjusted to be a valid phone for the domain object
      dateOfBirth: new Date(),
      password: "Test123@",
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };
    user = await useCaseCreate.execute(input);
  });

  test("Should update a user email, password and phone", async () => {
    const inputForUpdate = {
      id: user.id,
      email: "leo2@test2.com",
      phone: "47991079000",
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

  test("Should fail to update a client email, password and phone with invalid data", async () => {
    const inputForUpdate = {
      id: user.id,
      email: "leo2test2.com", // Invalid email
      phone: "+7991079000", // Invalid phone
      plainTextPassword: "123wrong", // Invalid password
    };
    await expect(
      useCaseUpdateClientPersonalInfo.execute(inputForUpdate),
    ).rejects.toThrow("Email does not meet criteria.");
  });
});

