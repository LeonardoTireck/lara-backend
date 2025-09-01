import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/repos/UserRepo";

describe("DynamoDbUserRepo - GetById", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should retrieve a user by ID from DynamoDB", async () => {
    const user = User.create(
      "Alice Wonderland",
      "alice@example.com",
      "11144477735",
      "11977776666",
      new Date("1980-10-10"),
      "hashedalicepassword",
      TrainingPlan.create("gold", "PIX"),
      "client",
    );

    await userRepo.save(user);

    const retrievedUser = await userRepo.getById(user.id);
    console.log(retrievedUser?.activePlan?.expirationDate);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toBe(user.id);
    expect(retrievedUser?.email).toBe(user.email);
  });

  test("should return undefined if user ID does not exist", async () => {
    const nonExistentId = "non-existent-id";
    const retrievedUser = await userRepo.getById(nonExistentId);
    expect(retrievedUser).toBeUndefined();
  });
});
