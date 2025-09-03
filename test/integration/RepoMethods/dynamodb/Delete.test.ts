import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/repos/UserRepo";

describe("DynamoDbUserRepo - Delete", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should delete a user from DynamoDB", async () => {
    const user = User.create(
      "Charlie Chaplin",
      "charlie@example.com",
      "11144477735",
      "11933334444",
      new Date("1960-03-03"),
      "hashedcharliepassword",
      TrainingPlan.create("silver", "card"),
      "client",
    );

    await userRepo.save(user);
    await userRepo.delete(user.id);

    const retrievedUser = await userRepo.getById(user.id);
    expect(retrievedUser).toBeUndefined();
  });

  test("should return an error if user ID to delete does not exist", async () => {
    const nonExistentId = "non-existent-delete-id";
    await expect(userRepo.delete(nonExistentId)).rejects.toThrow(
      `User with ID '${nonExistentId}' not found and could not be deleted.`,
    );
  });
});
