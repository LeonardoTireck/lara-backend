import jwt from "jsonwebtoken";
import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { FindAllUsers } from "../../../src/application/FindAllUsers.usecase";
import { FindUserById } from "../../../src/application/FindUserById.usecase";
import { UpdateUserById } from "../../../src/application/UpdateUserById.usecase";
import { UserLogin } from "../../../src/application/UserLogin.usecase";
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

test("Should create a user and find it by id", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseCreate = new CreateUser(repo);

  const inputForCreation = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };

  const userCreated = await useCaseCreate.execute(inputForCreation);
  const useCaseFind = new FindUserById(repo);

  const input = {
    userId: userCreated.id,
  };

  const user = await useCaseFind.execute(input);
  expect(user?.name).toBe("Leonardo");
  expect(user?.email).toBe("leo@test.com");
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
  const userId = userToGetId.id;

  const input2 = {
    id: userId,
    email: "leo@test2.com",
    password: "123test",
  };

  const user = await useCaseUpdate.execute(input2);

  expect(user.email).toBe("leo@test2.com");
  expect(user.name).toBe("Leonardo");
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
  expect(users).toHaveLength(2);
});

test("Should fail to return all users", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseFindAllUsers = new FindAllUsers(repo);
  const users = await useCaseFindAllUsers.execute();
  expect(users).toEqual([]);
});

test("Should login by email, verify the password match and return a JWT", async () => {
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

  const output = await useCaseLogin.execute(input2);
  expect(output).toBeDefined();

  const tokenPayload = jwt.verify(output!.token, process.env.JWT_SECRET!);
  expect(tokenPayload).toMatchObject({
    email: "leo@test.com",
    name: "Leonardo",
  });
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
