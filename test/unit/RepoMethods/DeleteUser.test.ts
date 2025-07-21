import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

test("Should delete a user", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const inputForCreation = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;
  const userCreated = await useCaseCreate.execute(inputForCreation);
  repo.delete(userCreated.id);
  expect(repo.users).toHaveLength(0);
});

test("Should fail to delete a user", async () => {
  const repo = new InMemoryUserRepo();

  expect(repo.delete("wrong Id")).rejects.toThrow("User not found.");
});
