import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

test("Should create a user", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  const user = await useCaseCreate.execute(input);
  expect(user.name).toBe("Leonardo");
  expect(user.email).toBe("leo@test.com");
});
