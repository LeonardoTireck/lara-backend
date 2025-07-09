import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { UpdateUserById } from "../../../src/application/UpdateUserById.usecase";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

test("Should create and then update a user email or password", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

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

test("Should fail to update a user email or password", async () => {
  const repo = new InMemoryUserRepo();

  const useCaseUpdate = new UpdateUserById(repo);

  const input2 = {
    id: "something",
    email: "leo@test2.com",
    password: "123test",
  };

  await expect(useCaseUpdate.execute(input2)).rejects.toThrow(
    "User not found.",
  );
});
