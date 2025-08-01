import jwt from "jsonwebtoken";
import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { UserLogin } from "../../src/application/usecases/UserLogin.usecase";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";
import { TrainingPlan } from "../../src/domain/TrainingPlan";

test("Should login by email, verify the password match and return a JWT", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const input1 = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    password: "Test123@",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;
  await useCaseCreate.execute(input1);
  const useCaseLogin = new UserLogin(repo, bcryptPasswordHasher);
  const input2 = {
    email: "leo@test.com",
    password: "Test123@",
  };
  const output = await useCaseLogin.execute(input2);
  expect(output).toBeDefined();
  const tokenPayload = jwt.verify(output!.token, process.env.JWT_SECRET!);
  expect(tokenPayload).toMatchObject({
    email: "leo@test.com",
    name: "Leonardo Tireck",
  });
});

test("Should fail to login by email, verify the password match and return a JWT", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  const input1 = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    password: "Test123@",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;
  await useCaseCreate.execute(input1);
  const useCaseLogin = new UserLogin(repo, bcryptPasswordHasher);
  const input2 = {
    email: "leo@test.com",
    password: "wrongpassword",
  };
  await expect(useCaseLogin.execute(input2)).rejects.toThrow(
    "Invalid Credentials.",
  );
});
