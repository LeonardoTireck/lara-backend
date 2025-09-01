export class TrainingSession {
  private constructor(
    readonly sessionDay: "A" | "B" | "C" | "D" | "E" | "F" | "G",
    readonly exercises: Exercise[],
    readonly notes?: string[],
    readonly durationMinutes?: number,
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    sessionDay: "A" | "B" | "C" | "D" | "E" | "F" | "G",
    exercises: Exercise[],
    notes?: string[],
    durationMinutes?: number,
  ) {
    return new TrainingSession(sessionDay, exercises, notes, durationMinutes);
  }

  static fromRaw(data: any): TrainingSession {
    const session = new TrainingSession(
      data.sessionDay,
      data.exercises,
      data.notes,
      data.durationMinutes,
      new Date(data.createdAt),
      new Date(data.updatedAt),
    );
    return session;
  }
}

type Exercise = {
  name: string;
  sets: Set[];
  notes: string;
  restInSeconds: number;
  videoUrl: string;
};

type Set = {
  orderNumber: number;
  reps: number;
  weight: number;
};
