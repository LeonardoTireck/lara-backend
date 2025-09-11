import {
  BadRequestError,
  ValidationError,
} from '../../../src/application/errors/AppError';
import { User } from '../../../src/domain/Aggregates/User';
import { Parq } from '../../../src/domain/ValueObjects/Parq';
import { TrainingPlan } from '../../../src/domain/ValueObjects/TrainingPlan';
import { TrainingSession } from '../../../src/domain/ValueObjects/TrainingSession';
import { UserType } from '../../../src/domain/ValueObjects/UserType';

describe('User Entity', () => {
  let activePlan: TrainingPlan;

  const defaultUserName = 'Leonardo Tireck';
  const defaultUserEmail = 'test@example.com';
  const defaultUserDocument = '11144477735';
  const defaultUserPhone = '11987654321';
  const defaultUserDob = new Date('1990-01-01');
  const defaultUserPassword = 'hashedPassword123';
  const defaultUserType: UserType = 'client';

  const createTestUser = (
    name: string = defaultUserName,
    email: string = defaultUserEmail,
    document: string = defaultUserDocument,
    phone: string = defaultUserPhone,
    dob: Date = defaultUserDob,
    password: string = defaultUserPassword,
    plan: TrainingPlan | undefined = activePlan,
    userType: UserType = defaultUserType,
  ) => {
    return User.create(
      name,
      email,
      document,
      phone,
      dob,
      password,
      plan!,
      userType,
    );
  };

  beforeEach(() => {
    activePlan = TrainingPlan.create('gold', 'card');
  });

  describe('User Creation', () => {
    it('should create a valid user', () => {
      const user = createTestUser();

      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe('string');
      expect(user.name).toBe(defaultUserName);
      expect(user.email).toBe(defaultUserEmail);
      expect(user.documentCPF).toBe(defaultUserDocument);
      expect(user.phone).toBe(defaultUserPhone);
      expect(user.hashedPassword).toBe(defaultUserPassword);
      expect(user.activePlan).toBe(activePlan);
      expect(user.userType).toBe(defaultUserType);
      expect(user.pastPlans).toEqual([]);
      expect(user.trainingSessions).toEqual([]);
    });

    it('should throw an error for an invalid name', () => {
      expect(() =>
        createTestUser(
          'Invalid',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw an error for an invalid email', () => {
      expect(() =>
        createTestUser(
          undefined,
          'invalid-email',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw an error for an invalid document (CPF)', () => {
      expect(() =>
        createTestUser(
          undefined,
          undefined,
          '12345',
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toThrow(ValidationError);
    });

    it('should throw an error for an invalid phone number', () => {
      expect(() =>
        createTestUser(
          undefined,
          undefined,
          undefined,
          '12345',
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toThrow(ValidationError);
    });
  });

  describe('User Updates', () => {
    it('should update email and phone', () => {
      const user = createTestUser();
      const newEmail = 'b@b.com';
      const newPhone = '21987654321';

      user.updateEmail(newEmail);
      user.updatePhone(newPhone);

      expect(user.email).toBe(newEmail);
      expect(user.phone).toBe(newPhone);
    });

    it('should update the password', () => {
      const user = createTestUser();
      const newPassword = 'newHashedPassword';
      user.updatePassword(newPassword);
      expect(user.hashedPassword).toBe(newPassword);
    });

    it('should update PARQ and last update date', () => {
      const user = createTestUser();
      const newParq = Parq.create(['q1'], ['a1']);

      user.updateParq(newParq);

      expect(user.parq).toBe(newParq);
      expect(user.lastParqUpdate).toBeDefined();
      expect(user.lastParqUpdate).toBeInstanceOf(Date);
    });

    it('should throw an error when updating PARQ with an invalid value', () => {
      const user = createTestUser();
      expect(() => user.updateParq(null as any)).toThrow(BadRequestError);
    });
  });

  describe('Plan Management', () => {
    it('should not move a non-expired plan to past plans', () => {
      const user = createTestUser();

      user.refreshPlans();

      expect(user.activePlan).toBe(activePlan);
      expect(user.pastPlans.length).toBe(0);
    });

    it('should move an expired plan to past plans', () => {
      const expiredPlan = TrainingPlan.create('silver', 'card');
      expiredPlan.expirationDate = new Date('2020-01-01'); // Expired date

      const user = createTestUser(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        expiredPlan,
      );

      user.refreshPlans();

      expect(user.activePlan).toBeUndefined();
      expect(user.pastPlans.length).toBe(1);
      expect(user.pastPlans[0]).toBe(expiredPlan);
    });

    it('should throw an error when refreshing plans if there is no active plan', () => {
      const user = new User(
        'user-id',
        'client',
        'Leo Tireck',
        new Date(),
        '11144477735',
        new Date(),
        'a@a.com',
        '11987654321',
        'pass',
        undefined, // explicitly create user with no active plan
      );

      expect(() => user.refreshPlans()).toThrow(BadRequestError);
    });

    it('should update the active plan', () => {
      const user = createTestUser();
      const newPlan = TrainingPlan.create('silver', 'PIX');

      user.updateActivePlan(newPlan);

      expect(user.activePlan).toBe(newPlan);
    });
  });

  describe('Training Session Management', () => {
    it('should add a new training session', () => {
      const user = createTestUser();
      const trainingSession = TrainingSession.create('A', [
        {
          name: 'Push-ups',
          sets: [{ orderNumber: 1, reps: 10, weight: 0 }],
          notes: '',
          restInSeconds: 0,
          videoUrl: '',
        },
      ]);
      user.addTrainingSession(trainingSession);
      expect(user.trainingSessions.length).toBe(1);
      expect(user.trainingSessions[0]).toBe(trainingSession);
    });

    it('should update training sessions', () => {
      const user = createTestUser();
      const trainingSession1 = TrainingSession.create('A', [
        {
          name: 'Push-ups',
          sets: [{ orderNumber: 1, reps: 10, weight: 0 }],
          notes: '',
          restInSeconds: 0,
          videoUrl: '',
        },
      ]);
      const trainingSession2 = TrainingSession.create('B', [
        {
          name: 'Squats',
          sets: [{ orderNumber: 1, reps: 10, weight: 0 }],
          notes: '',
          restInSeconds: 0,
          videoUrl: '',
        },
      ]);
      user.updateTrainingSessions([trainingSession1, trainingSession2]);
      expect(user.trainingSessions.length).toBe(2);
      expect(user.trainingSessions[0]).toBe(trainingSession1);
      expect(user.trainingSessions[1]).toBe(trainingSession2);
    });
  });

  describe('User.fromRaw', () => {
    let rawData: any;

    beforeEach(() => {
      const plan = TrainingPlan.create('gold', 'card');
      const session = TrainingSession.create('A', [
        {
          name: 'Push-ups',
          sets: [],
          notes: '',
          restInSeconds: 60,
          videoUrl: '',
        },
      ]);
      rawData = {
        id: 'user-123',
        userType: 'client',
        name: 'Raw User',
        dateOfFirstPlanIngress: new Date(),
        documentCPF: '11144477735',
        dateOfBirth: new Date('1985-08-15'),
        email: 'raw@user.com',
        phone: '11999998888',
        hashedPassword: 'rawPassword',
        activePlan: {
          ...plan,
          startDate: plan.startDate.toISOString(),
          expirationDate: plan.expirationDate.toISOString(),
        },
        pastPlans: [],
        parq: { _questions: ['q1'], _answers: ['a1'] },
        lastParqUpdate: new Date(),
        trainingSessions: [session],
      };
    });

    it('should create a User instance from raw data', () => {
      const user = User.fromRaw(rawData);
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(rawData.id);
      expect(user.name).toBe(rawData.name);
      expect(user.email).toBe(rawData.email);
      expect(user.activePlan).toBeInstanceOf(TrainingPlan);
      expect(user.parq).toBeInstanceOf(Parq);
      expect(user.trainingSessions[0]).toBeInstanceOf(TrainingSession);
    });

    it('should handle missing optional data', () => {
      delete rawData.activePlan;
      delete rawData.pastPlans;
      delete rawData.parq;
      delete rawData.lastParqUpdate;
      delete rawData.trainingSessions;

      const user = User.fromRaw(rawData);
      expect(user).toBeInstanceOf(User);
      expect(user.activePlan).toBeUndefined();
      expect(user.pastPlans).toEqual([]);
      expect(user.parq).toBeUndefined();
      expect(user.trainingSessions).toEqual([]);
    });

    it('should return the input if it is falsy', () => {
      expect(User.fromRaw(null)).toBeNull();
      expect(User.fromRaw(undefined)).toBeUndefined();
    });
  });
});
