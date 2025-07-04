import { CreateUser } from "../../../src/application/CreateUser.usecase.js";
import { User } from "../../../src/domain/User.js";
import { UserRepository } from "../../../src/domain/UserRepository.js";

class InMemoryUserRepo implements UserRepository {
  public users: User[] = [];

  async save(user: User) {
    this.users.push(user);
  }
}

test("Should create a user", async () => {
  const repo = new InMemoryUserRepo();
  const useCase = new CreateUser(repo);

  const input = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  const user = await useCase.execute(input);
  expect(user.name).toBe("Leonardo");
  expect(user.email).toBe("leo@test.com");
  expect(user.password).toBe("test123");
});
