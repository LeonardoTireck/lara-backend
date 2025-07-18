import { CreateUser } from "../../src/application/CreateUser.usecase";
import { UpdateUserById } from "../../src/application/UpdateUserById.usecase";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should create and then update a user email or password", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    userType: "admin",
  } as const;
  await useCaseCreate.execute(input1);
  const useCaseUpdate = new UpdateUserById(repo, bcryptPasswordHasher);
  const userToGetId = await repo.getByEmail(input1.email);
  if (!userToGetId) throw new Error("User not found.");
  const userId = userToGetId.id;
  const input2 = {
    id: userId,
    email: "leo@test2.com",
    plainTextPassword: "123test",
    phone: "+55555555",
  } as const;
  const user = await useCaseUpdate.execute(input2);
  expect(user.email).toBe("leo@test2.com");
  expect(user.name).toBe("Leonardo");
  expect(
    await bcryptPasswordHasher.compare(
      input2.plainTextPassword,
      user.hashedPassword,
    ),
  ).toBe(true);
});

test("Should create a user, create a training session and assign that to the user", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const input1 = {
    name: "Leonardo",
    email: "leo@test.com",
    password: "test123",
    phone: "+5547992000622",
    dateOfBirth: new Date("1997-12-04T08:00:00.000Z"),
    userType: "admin",
  } as const;
  await useCaseCreate.execute(input1);
  const useCaseUpdate = new UpdateUserById(repo, bcryptPasswordHasher);
  const userToGetId = await repo.getByEmail(input1.email);
  if (!userToGetId) throw new Error("User not found.");
  const userId = userToGetId.id;
  const input2 = {
    id: userId,
    email: userToGetId.email,
    plainTextPassword: userToGetId.hashedPassword,
    phone: userToGetId.phone,
    planType: "gold",
    lastParqUpdate: new Date(),
  } as const;
  const user = await useCaseUpdate.execute(input2);
  console.log(user);
});

test("Should fail to update a user email or password", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseUpdate = new UpdateUserById(repo, bcryptPasswordHasher);
  const input2 = {
    id: "something",
    email: "leo@test2.com",
    password: "123test",
  };

  await expect(useCaseUpdate.execute(input2)).rejects.toThrow(
    "User not found.",
  );
});
