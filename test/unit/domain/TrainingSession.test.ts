import { ValidationError } from '../../../src/application/errors/appError';
import { TrainingSession } from '../../../src/domain/valueObjects/trainingSession';

describe('TrainingSession Entity', () => {
  describe('TrainingSession Creation', () => {
    it('should create a valid training session with all properties', () => {
      const input = {
        sessionDay: 'A' as const,
        exercises: [
          {
            name: 'Supino',
            sets: [
              { orderNumber: 1, reps: 12, weight: 10 },
              { orderNumber: 2, reps: 10, weight: 20 },
              { orderNumber: 3, reps: 8, weight: 30 },
            ],
            notes: 'Dale pau',
            restInSeconds: 60,
            videoUrl: 'path/to/s3',
          },
        ],
        notes: ['Great work! Keep going!', 'Focus pocus!'],
        durationMinutes: 60,
      };

      const trainingSession = TrainingSession.create(
        input.sessionDay,
        input.exercises,
        input.notes,
        input.durationMinutes,
      );

      expect(trainingSession).toBeDefined();
      expect(trainingSession.sessionDay).toBe('A');
      expect(trainingSession.exercises).toEqual(input.exercises);
      expect(trainingSession.notes).toEqual(input.notes);
      expect(trainingSession.durationMinutes).toBe(60);
      expect(trainingSession.createdAt).toBeInstanceOf(Date);
      expect(trainingSession.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a valid training session without optional properties', () => {
      const input = {
        sessionDay: 'B' as const,
        exercises: [
          {
            name: 'Push-ups',
            sets: [{ orderNumber: 1, reps: 10, weight: 0 }],
            notes: '',
            restInSeconds: 0,
            videoUrl: '',
          },
        ],
      };

      const trainingSession = TrainingSession.create(
        input.sessionDay,
        input.exercises,
      );

      expect(trainingSession).toBeDefined();
      expect(trainingSession.sessionDay).toBe('B');
      expect(trainingSession.exercises).toEqual(input.exercises);
      expect(trainingSession.notes).toBeUndefined();
      expect(trainingSession.durationMinutes).toBeUndefined();
    });

    it('should throw an error if sessionDay is invalid', () => {
      expect(() => TrainingSession.create('Z' as any, [])).toThrow(
        ValidationError,
      );
    });

    it('should throw an error if exercises array is empty', () => {
      expect(() => TrainingSession.create('A', [])).toThrow(ValidationError);
    });
  });
});
