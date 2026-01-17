import { ValidationError } from '../../error/appError';

export class TrainingSession {
  private constructor(
    readonly sessionDay: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
    readonly exercises: Exercise[],
    readonly notes?: string[],
    readonly durationMinutes?: number,
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date(),
  ) {}

  static create(
    sessionDay: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G',
    exercises: Exercise[],
    notes?: string[],
    durationMinutes?: number,
  ) {
    const validSessionDays = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    if (!validSessionDays.includes(sessionDay)) {
      throw new ValidationError('Invalid session day.');
    }
    if (!exercises || exercises.length === 0) {
      throw new ValidationError('Exercises array cannot be empty.');
    }
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

interface Exercise {
  name: string;
  sets: Set[];
  notes: string;
  restInSeconds: number;
  videoUrl: string;
}

interface Set {
  orderNumber: number;
  reps: number;
  weight: number;
}
