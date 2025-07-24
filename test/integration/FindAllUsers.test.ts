import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { FindAllUsers } from "../../src/application/usecases/FindAllUsers.usecase";
import { TrainingPlan } from "../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should return all users", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const input1 = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    password: "Test123@",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;

  await useCaseCreate.execute(input1);
  const input2 = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    password: "Test123@",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    activePlan: TrainingPlan.create("gold", "card"),
    userType: "client",
    paymentMethod: "PIX",
  } as const;
  await useCaseCreate.execute(input2);
  const useCaseFindAllUsers = new FindAllUsers(repo);
  const users = await useCaseFindAllUsers.execute();
  expect(users).toHaveLength(2);
});

test("Should return an empty array of users", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseFindAllUsers = new FindAllUsers(repo);
  const users = await useCaseFindAllUsers.execute();
  expect(users).toEqual([]);
});
