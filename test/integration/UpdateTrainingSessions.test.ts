import { CreateUser } from "../../src/application/usecases/CreateUser.usecase";
import { FindUserById } from "../../src/application/usecases/FindUserById.usecase";
import { UpdateTrainingSessions } from "../../src/application/usecases/UpdateTrainingSessions.usecase";
import { TrainingPlan } from "../../src/domain/TrainingPlan";
import { TrainingSession } from "../../src/domain/TrainingSession";
import BcryptPasswordHasher from "../../src/infrastructure/Hashing/BcryptPasswordHasher";
import { InMemoryUserRepo } from "../../src/infrastructure/UserRepo/InMemory";

test("Should add a training session to a client", async () => {
  const repo = new InMemoryUserRepo();
  const bcryptPasswordHasher = new BcryptPasswordHasher(1);
  const useCaseCreate = new CreateUser(repo, bcryptPasswordHasher);

  const input = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    password: "Test123@",
    activePlan: TrainingPlan.create("silver", "PIX"),
    userType: "client",
  } as const;

  const user = await useCaseCreate.execute(input);

  const useCaseFindById = new FindUserById(repo);
  let currentTrainingSessions = (
    await useCaseFindById.execute({ userId: user.id })
  ).trainingSessions;
  const newTrainingSession = TrainingSession.create(
    "A",
    [
      {
        name: "Supino Reto",
        sets: [
          { orderNumber: 1, reps: 10, weight: 10 },
          { orderNumber: 2, reps: 10, weight: 10 },
          { orderNumber: 3, reps: 10, weight: 10 },
        ],
        notes: "notes about the specific exercise",
        restInSeconds: 60,
        videoUrl: "videoUrl",
      },
    ],
    ["Array of notes about the training session itself"],
    60,
  );
  currentTrainingSessions!.push(newTrainingSession);
  const useCaseUpdateTrainingSessions = new UpdateTrainingSessions(repo);

  const updatedUser = await useCaseUpdateTrainingSessions.execute(
    user.id,
    currentTrainingSessions!,
  );

  expect(updatedUser.trainingSessions[0].sessionDay).toBe("A");
  expect(updatedUser.trainingSessions[0].exercises[0].name).toBe("Supino Reto");
  expect(updatedUser.trainingSessions[0].exercises[0].sets[0].orderNumber).toBe(
    1,
  );
  expect(updatedUser.trainingSessions[0].exercises[0].notes).toBe(
    "notes about the specific exercise",
  );
  expect(updatedUser.trainingSessions[0].durationMinutes).toBe(60);
});
