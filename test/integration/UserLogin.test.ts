import jwt from "jsonwebtoken";
import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { UserLogin } from "../../src/application/usecases/UserLogin.usecase";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";
import { TrainingPlan } from "../../src/domain/TrainingPlan";

describe("UserLogin Integration Test", () => {
  let repo: InMemoryUserRepo;
  let bcryptPasswordHasher: BcryptPasswordHasher;
  let useCaseLogin: UserLogin;

  const userEmail = "leo@test.com";
  const userPassword = "Test123@";

  beforeEach(async () => {
    repo = new InMemoryUserRepo();
    bcryptPasswordHasher = new BcryptPasswordHasher(1);
    useCaseLogin = new UserLogin(repo, bcryptPasswordHasher);
    const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

    const input = {
      name: "Leonardo Tireck",
      email: userEmail,
      documentCPF: "11144477735",
      password: userPassword,
      phone: "47992000622",
      dateOfBirth: new Date(),
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };
    await useCaseCreate.execute(input);
  });

  test("Should login by email, verify the password match and return a JWT", async () => {
    const input = {
      email: userEmail,
      password: userPassword,
    };
    const output = await useCaseLogin.execute(input);
    expect(output).toBeDefined();

    const tokenPayload = jwt.verify(output!.token, process.env.JWT_SECRET!);
    expect(tokenPayload).toMatchObject({
      email: userEmail,
      name: "Leonardo Tireck",
    });
  });

  test("Should fail to login with an incorrect password", async () => {
    const input = {
      email: userEmail,
      password: "wrongpassword",
    };
    await expect(useCaseLogin.execute(input)).rejects.toThrow(
      "Invalid Credentials."
    );
  });
});