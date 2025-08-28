import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/UserRepo";

describe("DynamoDbUserRepo", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should save a user to DynamoDB", async () => {
    const mockTrainingPlan = TrainingPlan.create("silver", "card");
    console.log(mockTrainingPlan);

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

    console.log(user);

    await userRepo.save(user);
  });
});
