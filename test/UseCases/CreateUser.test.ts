import "dotenv/config";
import { CreateUser } from "../../src/application/CreateUser.usecase";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";
import { TrainingPlan } from "../../src/domain/TrainingPlan";

test("Should create a user", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

  const input = {
    name: "Leonardo",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    password: "Test123@",
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;

  const user = await useCaseCreate.execute(input);
  expect(user.name).toBe("Leonardo");
  expect(user.email).toBe("leo@test.com");
});
