import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/repos/UserRepo";

describe("DynamoDbUserRepo", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should save a user to DynamoDB", async () => {
    const mockTrainingPlan = TrainingPlan.create("silver", "card");
    const user = User.create(
      "John Doe",
      "johndoe@example.com",
      "11144477735",
      "11987654321",
      new Date("1990-01-01"),
      "hashedpassword123",
      mockTrainingPlan,
      "client",
    );

    expect(await userRepo.save(user)).resolves;
  });
});
