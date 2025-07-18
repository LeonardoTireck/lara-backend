import { CreateUser } from "../../src/application/CreateUser.usecase";
import { FindUserById } from "../../src/application/FindUserById.usecase";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should create a user and find it by id", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

  const inputForCreation = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    userType: "admin",
  } as const;

  const userCreated = await useCaseCreate.execute(inputForCreation);
  const useCaseFind = new FindUserById(repo);

  const input = {
    userId: userCreated.id,
  };

  const user = await useCaseFind.execute(input);
  expect(user?.name).toBe("Leonardo");
  expect(user?.email).toBe("leo@test.com");
});

test("Should fail to find a user by id", async () => {
  const repo = new InMemoryUserRepo();
  const useCaseFind = new FindUserById(repo);

  const input = {
    userId: "randomstring",
  };

  await expect(useCaseFind.execute(input)).rejects.toThrow("User not found.");
});
