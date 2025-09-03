import { CreateUser } from "../../../../src/application/usecases/CreateUser.usecase";
import { UserLogin } from "../../../../src/application/usecases/UserLogin.usecase";
import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../../src/infrastructure/UserRepo/InMemory";

describe("User Login Failure Case Test", () => {
  let repo: InMemoryUserRepo;
  let useCaseLogin: UserLogin;

  beforeEach(async () => {
    repo = new InMemoryUserRepo();
    const bcryptPasswordHasher = new BcryptPasswordHasher(1);
    useCaseLogin = new UserLogin(repo, bcryptPasswordHasher);
    const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

    const input = {
      name: "Leonardo Tireck",
      email: "leo2@test.com",
      documentCPF: "11144477735",
      password: "Test123@",
      phone: "47992000622",
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };
    await useCaseCreate.execute(input);
  });

  test("Should return an error when finding a user by a non-existent email", async () => {
    const input = {
      email: "wrongEmail@test.com",
      password: "Test123@",
    };
    await expect(useCaseLogin.execute(input)).rejects.toThrow(
      "Invalid Credentials",
    );
  });
});
