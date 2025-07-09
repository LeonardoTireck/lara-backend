import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { FindAllUsers } from "../../../src/application/FindAllUsers.usecase";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

test("Should return all users", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const input2 = {
    name: "Lara",
    email: "lara@test.com",
    password: "test321",
  };
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
