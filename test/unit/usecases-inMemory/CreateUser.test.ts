import "dotenv/config";
import { CreateUser } from "../../../src/application/usecases/CreateUser.usecase";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import BcryptPasswordHasher from "../../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../../src/infrastructure/UserRepo/InMemory";

describe("CreateUser Use Case", () => {
  let repo: InMemoryUserRepo;
  let bcryptPasswordHasher: BcryptPasswordHasher;
  let useCaseCreate: CreateUser;

  beforeEach(() => {
    repo = new InMemoryUserRepo();
    bcryptPasswordHasher = new BcryptPasswordHasher(1);
    useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  });

  it("should create a user successfully", async () => {
    const input = {
      name: "Leonardo Tireck",
      email: "leo@test.com",
      documentCPF: "11144477735",
      phone: "47992000622",
      dateOfBirth: new Date("1990-01-01"),
      password: "Test123@",
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };

    const user = await useCaseCreate.execute(input);

    expect(user.id).toBeDefined();
    expect(user.name).toBe(input.name);
    expect(user.email).toBe(input.email);
    expect(user.activePlan).toEqual(input.activePlan);
    expect(repo.users).toHaveLength(1);
    expect(repo.users[0].email).toBe(input.email);
  });

  it("should throw an error for invalid email", async () => {
    const input = {
      name: "Leonardo Tireck",
      email: "invalid-email", // Invalid email
      documentCPF: "11144477735",
      phone: "47992000622",
      dateOfBirth: new Date("1990-01-01"),
      password: "Test123@",
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };

    await expect(useCaseCreate.execute(input)).rejects.toThrow(
      "Email does not meet criteria.",
    );
    expect(repo.users).toHaveLength(0);
  });

  it("should throw an error for duplicate email", async () => {
    const input = {
      name: "Leonardo Tireck",
      email: "leo@test.com",
      documentCPF: "11144477735",
      phone: "47992000622",
      dateOfBirth: new Date("1990-01-01"),
      password: "Test123@",
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };

    await useCaseCreate.execute(input);

    await expect(useCaseCreate.execute(input)).rejects.toThrow(
      "User with this email already exists.",
    );
    expect(repo.users).toHaveLength(1);
  });

  it("should throw an error for invalid password", async () => {
    const input = {
      name: "Leonardo Tireck",
      email: "leo@test.com",
      documentCPF: "11144477735",
      phone: "47992000622",
      dateOfBirth: new Date("1990-01-01"),
      password: "short", // Invalid password
      activePlan: TrainingPlan.create("silver", "PIX"),
      userType: "client" as const,
    };

    await expect(useCaseCreate.execute(input)).rejects.toThrow(
      "Password does not meet criteria.",
    );
    expect(repo.users).toHaveLength(0);
  });
});