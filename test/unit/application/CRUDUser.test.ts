import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { FindUserById } from "../../../src/application/FindUserById.usecase";
import { UpdateUserById } from "../../../src/application/UpdateUserById.usecase";
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

  async delete(userId: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === userId);
    const userIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(userIndex, 1);
    if (user) return user;
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

  const user = await useCaseFind.execute(input2);
  expect(user?.name).toBe("Leonardo");
  expect(user?.email).toBe("leo@test.com");
  expect(user?.password).toBe("test123");
});

test("Should create and then update a user email or password", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    id: "1",
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const useCaseUpdate = new UpdateUserById(repo);

  const input2 = {
    id: "1",
    email: "leo@test2.com",
    password: "123test",
  };

  const user = await useCaseUpdate.execute(input2);

  console.log(repo.users);
  expect(user?.id).toBe("1");
  expect(user?.email).toBe("leo@test2.com");
  expect(user?.name).toBe("Leonardo");
  expect(user?.password).toBe("123test");
});
