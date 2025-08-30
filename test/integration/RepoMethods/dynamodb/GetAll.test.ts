import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/repos/UserRepo";

describe("DynamoDbUserRepo - GetAll", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should retrieve all users from DynamoDB", async () => {
    // Save a few users first
    const user1 = User.create(
      "User One",
      "user1@example.com",
      "11144477735",
      "11911111111",
      new Date("1990-01-01"),
      "hashedpass1",
      TrainingPlan.create("silver", "card"),
      "client",
    );
    await userRepo.save(user1);

    const user2 = User.create(
      "User Two",
      "user2@example.com",
      "11144477735",
      "11922222222",
      new Date("1991-02-02"),
      "hashedpass2",
      TrainingPlan.create("gold", "PIX"),
      "client",
    );
    await userRepo.save(user2);

    const users = await userRepo.getAll();

    expect(users).toBeDefined();
    expect(users?.length).toBeGreaterThanOrEqual(2); // May contain users from other tests

    const foundUser1 = users?.find((u) => u.id === user1.id);
    const foundUser2 = users?.find((u) => u.id === user2.id);

    expect(foundUser1).toBeDefined();
    expect(foundUser2).toBeDefined();
  });
});
