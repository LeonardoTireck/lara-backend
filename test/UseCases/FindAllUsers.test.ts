import { CreateUser } from "../../src/application/CreateUser.usecase";
import { FindAllUsers } from "../../src/application/FindAllUsers.usecase";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should return all users", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    userType: "admin",
    planType: "diamond",
    paymentMethod: "PIX",
  } as const;
  await useCaseCreate.execute(input1);
  const input2 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    userType: "client",
    planType: "diamond",
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
