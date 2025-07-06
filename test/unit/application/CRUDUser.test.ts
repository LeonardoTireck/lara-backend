import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { FindAllUsers } from "../../../src/application/FindAllUsers.usecase";
import { FindUserById } from "../../../src/application/FindUserById.usecase";
import { UpdateUserById } from "../../../src/application/UpdateUserById.usecase";
import { UserLogin } from "../../../src/application/UserLogin.usecase";
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

  async getById(userId: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === userId);
    return user;
  }

  async getByEmail(userEmail: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === userEmail);
    return user;
  }

  async delete(userId: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === userId);
    const userIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(userIndex, 1);
    if (user) return user;
  }

  async getAll(): Promise<User[] | undefined> {
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
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  const user = await useCase.execute(input);
  expect(user.name).toBe("Leonardo");
  expect(user.email).toBe("leo@test.com");
});

test("Should find a user by id", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseFind = new FindUserById(repo);

  const input = {
    userId: "99",
  };

  const user = await useCaseFind.execute(input);
  expect(user?.name).toBe("John Doe");
  expect(user?.email).toBe("john@doe.com");
});

test("Should create and then update a user email or password", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const useCaseUpdate = new UpdateUserById(repo);
  const userToGetId = await repo.getByEmail(input1.email);
  if (!userToGetId) throw new Error("User not found.");
  const userId = userToGetId?.id;

  const input2 = {
    id: userId,
    email: "leo@test2.com",
    password: "123test",
  };

  const user = await useCaseUpdate.execute(input2);

  expect(user.email).toBe("leo@test2.com");
  expect(user.name).toBe("Leonardo");
  expect(user.password).toBe("123test");
});

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
  expect(users).toHaveLength(3);
});

test("Should find a user by email, verify the password match and return a JWT", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const useCaseLogin = new UserLogin(repo);

  const input2 = {
    email: "leo@test.com",
    password: "test123",
  };

  const token = await useCaseLogin.execute(input2);
  expect(token).toBeDefined();
});

test("Should return an error when findind a user by email", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const useCaseLogin = new UserLogin(repo);

  const input2 = {
    email: "wrongEmail@test.com",
    password: "test123",
  };

  await expect(useCaseLogin.execute(input2)).rejects.toThrow(
    "Invalid Credentials",
  );
});
