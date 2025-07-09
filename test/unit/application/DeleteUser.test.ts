import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

test("Should delete a user", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const inputForCreation = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  const userCreated = await useCaseCreate.execute(inputForCreation);
  repo.delete(userCreated.id);
  expect(repo.users).toHaveLength(0);
});

test("Should fail to delete a user", async () => {
  const repo = new InMemoryUserRepo();

  expect(repo.delete("wrong Id")).rejects.toThrow("User not found.");
});
