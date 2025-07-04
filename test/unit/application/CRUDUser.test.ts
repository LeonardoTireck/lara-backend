import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { FindUserById } from "../../../src/application/FindUserById.usecase";
import { User } from "../../../src/domain/User";
import { UserRepository } from "../../../src/domain/UserRepository";

class InMemoryUserRepo implements UserRepository {
  public users: User[] = [];

  async save(user: User) {
    this.users.push(user);
  }

  async findById(userId: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === userId);
    return user;
  }
}

test("Should create a user", async () => {
  const repo = new InMemoryUserRepo();
  const useCase = new CreateUser(repo);

  const input = {
    id: "1",
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  const user = await useCase.execute(input);
  console.log(user);
  expect(user.name).toBe("Leonardo");
  expect(user.email).toBe("leo@test.com");
  expect(user.password).toBe("test123");
});

test("Should create and then find a user by id", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    id: "1",
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  await useCaseCreate.execute(input1);

  const useCaseFind = new FindUserById(repo);

  const input2 = {
    userId: "1",
  };

  const user = await useCaseFind.execute(input2.userId);
  console.log(user);
  expect(user?.name).toBe("Leonardo");
  expect(user?.email).toBe("leo@test.com");
  expect(user?.password).toBe("test123");
});
