import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { FindAllUsers } from "../../src/application/usecases/FindAllUsers.usecase";
import { TrainingPlan } from "../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

describe("FindAllUsers Integration Test", () => {
  let repo: InMemoryUserRepo;
  let useCaseFindAllUsers: FindAllUsers;

  beforeEach(() => {
    repo = new InMemoryUserRepo();
    useCaseFindAllUsers = new FindAllUsers(repo);
  });

  test("Should return all users", async () => {
    const bcryptPasswordHasher = new BcryptPasswordHasher(1);
    const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

    const input1 = {
      name: "Leonardo Tireck",
      email: "leo@test.com",
      documentCPF: "11144477735",
      password: "Test123@",
      phone: "47992000622",
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };
    await useCaseCreate.execute(input1);

    const input2 = {
      name: "Leonardo Tireck",
      email: "leo2@test.com",
      documentCPF: "88877766603",
      password: "Test123@",
      phone: "47991079000",
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create("gold", "card"),
      userType: "client" as const,
    };
    await useCaseCreate.execute(input2);

    const users = await useCaseFindAllUsers.execute();
    expect(users).toHaveLength(2);
  });

  test("Should return an empty array of users", async () => {
    const users = await useCaseFindAllUsers.execute();
    expect(users).toEqual([]);
  });
});