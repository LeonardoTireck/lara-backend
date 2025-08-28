import { CreateUser } from "../../../src/application/usecases/CreateUser.usecase";
import { FindUserById } from "../../../src/application/usecases/FindUserById.usecase";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

describe("FindUserById Integration Test", () => {
  let repo: InMemoryUserRepo;
  let useCaseFind: FindUserById;

  beforeEach(() => {
    repo = new InMemoryUserRepo();
    useCaseFind = new FindUserById(repo);
  });

  test("Should create a user and find it by id", async () => {
    const bcryptPasswordHasher = new BcryptPasswordHasher(1);
    const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
    const inputForCreation = {
      name: "Leonardo Tireck",
      email: "leo@test.com",
      documentCPF: "11144477735",
      password: "Test123@",
      phone: "47992000622",
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };
    const userCreated = await useCaseCreate.execute(inputForCreation);

    const input = {
      userId: userCreated.id,
    };

    const user = await useCaseFind.execute(input);
    expect(user.name).toBe("Leonardo Tireck");
    expect(user.email).toBe("leo@test.com");
  });

  test("Should fail to find a user by id", async () => {
    const input = {
      userId: "randomstring",
    };

    await expect(useCaseFind.execute(input)).rejects.toThrow("User not found.");
  });
});

