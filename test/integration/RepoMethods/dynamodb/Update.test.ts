import { Parq } from "../../../../src/domain/Parq";
import { TrainingPlan } from "../../../../src/domain/TrainingPlan";
import { User } from "../../../../src/domain/User";
import { DynamoDbUserRepo } from "../../../../src/infrastructure/dynamodb/repos/UserRepo";

describe("DynamoDbUserRepo - Update", () => {
  let userRepo: DynamoDbUserRepo;

  beforeAll(() => {
    userRepo = new DynamoDbUserRepo();
  });

  test("should update all user fields in DynamoDB", async () => {
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
    const newPassword = "newhashedpassword";
    const newPlan = TrainingPlan.create("gold", "PIX");
    const newParq = Parq.create(["question1"], ["answer1"]);

    user.updatePhone(updatedPhone);
    user.updateEmail(updatedEmail);
    user.updatePassword(newPassword);
    user.updateActivePlan(newPlan);
    user.updateParq(newParq);

    await userRepo.update(user);

    const retrievedUser = await userRepo.getById(user.id);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.phone).toBe(updatedPhone);
    expect(retrievedUser?.email).toBe(updatedEmail);
    expect(retrievedUser?.hashedPassword).toBe(newPassword);
    expect(retrievedUser?.activePlan?.planType).toBe("gold");
    expect(retrievedUser?.parq?.questions[0]).toBe("question1");
    expect(retrievedUser?.lastParqUpdate).toBeDefined();
  });
});
