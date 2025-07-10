import { CreateUser } from "../../../src/application/CreateUser.usecase";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";
import "dotenv/config";

test("Should create a user", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

  const input = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    userType: "admin",
    planType: "diamond",
    paymentMethod: "PIX",
  } as const;

  const user = await useCaseCreate.execute(input);
  console.log(user);
  expect(user.name).toBe("Leonardo");
  expect(user.email).toBe("leo@test.com");
});
