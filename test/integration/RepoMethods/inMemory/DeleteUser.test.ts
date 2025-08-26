import { CreateUser } from "../../../../src/application/usecases/CreateUser.usecase";
import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../../src/infrastructure/UserRepo/InMemory";

describe("InMemoryUserRepo Delete Method Test", () => {
  let repo: InMemoryUserRepo;

  beforeEach(() => {
    repo = new InMemoryUserRepo();
  });

  test("Should delete a user", async () => {
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

    await repo.delete(userCreated.id);

    expect(repo.users).toHaveLength(0);
  });

  test("Should fail to delete a user with a non-existent id", async () => {
    await expect(repo.delete("wrong Id")).rejects.toThrow("User not found.");
  });
});