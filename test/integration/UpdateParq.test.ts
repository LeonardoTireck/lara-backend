import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { UpdateParq } from "../../src/application/usecases/UpdateParq.usecase";
import { Parq } from "../../src/domain/Parq";
import { TrainingPlan } from "../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should update a user's Parq", async () => {
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

  const useCaseUpdateParq = new UpdateParq(repo);

  const inputForParq = {
    userId: user.id,
    newParq: Parq.create(["Question1", "Question2"], ["Answer1", "Answer2"]),
  };

  const updatedUser = await useCaseUpdateParq.execute(inputForParq);

  expect(updatedUser).toBeDefined();
  expect(updatedUser.parq).toBeDefined();
  expect(updatedUser.parq?.questions).toBeDefined();
});
