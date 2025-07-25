import { TrainingSession } from "../../../src/domain/TrainingSession";

test("Should create and return a new TrainingSession", async () => {
  const input = {
    sessionDay: "A" as const,
    sessionId: 1,
    exercises: [
      {
        name: "Supino",
        sets: [
          { orderNumber: 1, reps: 12, weight: 10 },
          { orderNumber: 2, reps: 10, weight: 20 },
          { orderNumber: 3, reps: 8, weight: 30 },
        ],
        notes: "Dale pau",
        restInSeconds: 60,
        videoUrl: "path to S3",
      },
    ],
    notes: ["Great work! Keep going!", "Focus pocus!"],
    durationMinutes: 60,
  };
  const traningSession = TrainingSession.create(
    input.sessionDay,
    input.exercises,
    input.notes,
    input.durationMinutes,
  );
  expect(traningSession).toBeDefined();
});
