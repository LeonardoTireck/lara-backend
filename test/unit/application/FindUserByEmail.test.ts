import { CreateUser } from "../../../src/application/CreateUser.usecase";
import { UserLogin } from "../../../src/application/UserLogin.usecase";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

test("Should return an error when findind a user by email", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
  };
  await useCaseCreate.execute(input1);

  const useCaseLogin = new UserLogin(repo, bcryptPasswordHasher);

  const input2 = {
    email: "wrongEmail@test.com",
    password: "test123",
  };

  await expect(useCaseLogin.execute(input2)).rejects.toThrow(
    "Invalid Credentials",
  );
});
