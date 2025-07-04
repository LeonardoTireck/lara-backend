import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { FindAllUsers } from "../../../src/application/FindAllUsers.usecase";
import { FindUserById } from "../../../src/application/FindUserById.usecase";
import { UpdateUserById } from "../../../src/application/UpdateUserById.usecase";
import { User } from "../../../src/domain/User";
import { UserRepository } from "../../../src/domain/UserRepository";

class InMemoryUserRepo implements UserRepository {
  public users: User[] = [
    {
      id: "99",
      name: "John Doe",
      email: "john@doe.com",
      password: "securePassword",
    },
  ];

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

  async findAll(): Promise<User[] | undefined> {
    const output = this.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      };
    });
    return output;
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

  expect(user?.id).toBe("1");
  expect(user?.email).toBe("leo@test2.com");
  expect(user?.name).toBe("Leonardo");
  expect(user?.password).toBe("123test");
});

test("Should return all users", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    id: "1",
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const input2 = {
    id: "2",
    name: "Lara",
    email: "lara@test.com",
    password: "test321",
  };
  await useCaseCreate.execute(input2);

  const useCaseFindAllUsers = new FindAllUsers(repo);
  const users = await useCaseFindAllUsers.execute();
  console.log(users);
  expect(users).toHaveLength(3);
});
