import { Exercise } from "./Exercise";

export class TrainingSession {
  private constructor(
    readonly sessionDay: "A" | "B" | "C" | "D" | "E" | "F" | "G",
    readonly sessionId: number,
    readonly exercises: Exercise[],
    readonly notes?: string[],
    readonly durationMinutes?: number,
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    sessionDay: "A" | "B" | "C" | "D" | "E" | "F" | "G",
    sessionId: number,
    exercises: Exercise[],
    notes?: string[],
    durationMinutes?: number,
  ) {
    return new TrainingSession(
      sessionDay,
      sessionId,
      exercises,
      notes,
      durationMinutes,
    );
  }
}
