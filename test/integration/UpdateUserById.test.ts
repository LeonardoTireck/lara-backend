import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { Exercise } from "../../src/domain/Exercise";
import { TrainingPlan } from "../../src/domain/TrainingPlan";
import { TrainingSession } from "../../src/domain/TrainingSession";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should create and then update a user email or password", async () => {
  // const repo = new InMemoryUserRepo();
  // const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  // const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  // const input1 = {
  //   name: "Leonardo Tireck",
  //   email: "leo@test.com",
  //   documentCPF: "987.654.321-00",
  //   password: "Test123@",
  //   phone: "+5547992000622",
  //   dateOfBirth: new Date(),
  //   activePlan: TrainingPlan.create("silver", "PIX"),
  //   userType: "client",
  // } as const;
  // await useCaseCreate.execute(input1);
  // const useCaseUpdate = new UpdateUserById(repo, bcryptPasswordHasher);
  // const userToGetId = await repo.getByEmail(input1.email);
  // if (!userToGetId) throw new Error("User not found.");
  // const userId = userToGetId.id;
  // const input2 = {
  //   id: userId,
  //   email: "leo@test2.com",
  //   plainTextPassword: "@Test123",
  //   phone: "+55555555",
  //   activePlan: userToGetId.activePlan,
  // } as const;
  // const user = await useCaseUpdate.execute(input2);
  // expect(user.email).toBe("leo@test2.com");
  // expect(user.name).toBe("Leonardo Tireck");
  // expect(
  //   await bcryptPasswordHasher.compare(
  //     input2.plainTextPassword,
  //     user.hashedPassword,
  //   ),
  // ).toBe(true);
});

test("Should create a user, create a training session and assign that to the user", async () => {
  // const repo = new InMemoryUserRepo();
  // const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  // const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);
  // const input1 = {
  //   name: "Leonardo Tireck",
  //   email: "leo@test.com",
  //   documentCPF: "987.654.321-00",
  //   password: "Test123@",
  //   phone: "+5547992000622",
  //   dateOfBirth: new Date(),
  //   activePlan: TrainingPlan.create("silver", "PIX"),
  //   userType: "client",
  // } as const;
  // await useCaseCreate.execute(input1);
  // const sessionExercises = [
  //   new Exercise(
  //     "Supino Inclinado",
  //     [{ orderNumber: 1, reps: 12, weight: 100 }],
  //     "Dale",
  //     60,
  //     "amazonS3",
  //   ),
  // ];
  // const newTrainingSession = [
  //   TrainingSession.create(
  //     "A",
  //     1,
  //     sessionExercises,
  //     ["Treino de peito focando em superior"],
  //     60,
  //   ),
  // ];
  // const useCaseUpdate = new UpdateUserById(repo, bcryptPasswordHasher);
  // const userToGetId = await repo.getByEmail(input1.email);
  // if (!userToGetId) throw new Error("User not found.");
  // const userId = userToGetId.id;
  // const input2 = {
  //   id: userId,
  //   email: userToGetId.email,
  //   plainTextPassword: userToGetId.hashedPassword,
  //   phone: userToGetId.phone,
  //   activePlan: TrainingPlan.create("silver", "PIX"),
  //   lastParqUpdate: new Date(),
  //   trainingSessions: newTrainingSession,
  // } as const;
  // const newUser = await useCaseUpdate.execute(input2);
  // console.log(newUser);
  // expect(newUser).toBeDefined();
  // expect(newUser.trainingSessions).toBeDefined();
  // expect(newUser.activePlan).toBeDefined();
});

test("Should fail to update a user email or password", async () => {
  // const repo = new InMemoryUserRepo();
  // const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  // const useCaseUpdate = new UpdateUserById(repo, bcryptPasswordHasher);
  // const input2 = {
  //   id: "something",
  //   email: "leo@test2.com",
  //   password: "Test123@",
  //   activePlan: TrainingPlan.create("silver", "PIX"),
  // };
  //
  // await expect(useCaseUpdate.execute(input2)).rejects.toThrow(
  //   "User not found.",
  // );
});
