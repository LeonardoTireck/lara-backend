import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/UserRepo";

describe("DynamoDbUserRepo - Update", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should update a user in DynamoDB", async () => {
    const user = User.create(
      "Jane Doe",
      "janedoe@example.com",
      "11144477735",
      "11987654321",
      new Date("1995-05-05"),
      "initialhashedpassword",
      TrainingPlan.create("silver", "card"),
      "client",
    );

    await userRepo.save(user);

    const updatedPhone = "48999999999";
    const updatedEmail = "janesmith@example.com";
    user.updatePhone(updatedPhone);
    user.updateEmail(updatedEmail);

    await userRepo.update(user);

    const retrievedUser = await userRepo.getById(user.id);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.name).toBe(updatedPhone);
    expect(retrievedUser?.email).toBe(updatedEmail);
  });
});
