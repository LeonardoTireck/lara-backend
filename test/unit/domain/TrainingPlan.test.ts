import { ValidationError } from '../../../src/application/errors/appError';
import { PlanType } from '../../../src/domain/valueObjects/planType';
import { TrainingPlan } from '../../../src/domain/valueObjects/trainingPlan';

describe('TrainingPlan Value Object', () => {
  it('should create a valid silver plan and set expiration date to 1 month from now', () => {
    const plan = TrainingPlan.create('silver', 'card');
    const expectedExpiration = new Date();
    expectedExpiration.setMonth(expectedExpiration.getMonth() + 1);

    expect(plan.planType).toBe('silver');
    expect(plan.paymentMethod).toBe('card');
    // Check if dates are close enough (e.g., within a few seconds)
    expect(plan.expirationDate.getTime()).toBeCloseTo(
      expectedExpiration.getTime(),
      -2,
    );
  });

  it('should create a valid gold plan and set expiration date to 3 months from now', () => {
    const plan = TrainingPlan.create('gold', 'PIX');
    const expectedExpiration = new Date();
    expectedExpiration.setMonth(expectedExpiration.getMonth() + 3);

    expect(plan.planType).toBe('gold');
    expect(plan.expirationDate.getTime()).toBeCloseTo(
      expectedExpiration.getTime(),
      -2,
    );
  });

  it('should create a valid diamond plan and set expiration date to 6 months from now', () => {
    const plan = TrainingPlan.create('diamond', 'card');
    const expectedExpiration = new Date();
    expectedExpiration.setMonth(expectedExpiration.getMonth() + 6);

    expect(plan.planType).toBe('diamond');
    expect(plan.expirationDate.getTime()).toBeCloseTo(
      expectedExpiration.getTime(),
      -2,
    );
  });

  it('should throw a ValidationError for an invalid planType', () => {
    const invalidPlanType = 'unobtanium' as PlanType;
    expect.assertions(2);
    try {
      TrainingPlan.create(invalidPlanType, 'card');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.details).toBe('Invalid planType: unobtanium.');
      }
    }
  });

  describe('fromRaw', () => {
    it('should create a TrainingPlan instance from raw data', () => {
      const startDate = new Date('2023-01-01');
      const expirationDate = new Date('2023-02-01');
      const rawData = {
        planType: 'silver',
        paymentMethod: 'card',
        startDate: startDate.toISOString(),
        expirationDate: expirationDate.toISOString(),
      };

      const plan = TrainingPlan.fromRaw(rawData);

      expect(plan).toBeInstanceOf(TrainingPlan);
      expect(plan.planType).toBe('silver');
      expect(plan.paymentMethod).toBe('card');
      expect(plan.startDate).toEqual(startDate);
      expect(plan.expirationDate).toEqual(expirationDate);
    });

    it('should return the input if it is falsy', () => {
      expect(TrainingPlan.fromRaw(null)).toBeNull();
      expect(TrainingPlan.fromRaw(undefined)).toBeUndefined();
    });
  });
});
