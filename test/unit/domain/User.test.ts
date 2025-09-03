import { Parq } from "../../../src/domain/Parq";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import { TrainingSession } from "../../../src/domain/TrainingSession";
import { User } from "../../../src/domain/User";

describe("User Entity", () => {
  let activePlan: TrainingPlan;

  beforeEach(() => {
    activePlan = TrainingPlan.create("gold", "card");
  });

  describe("User Creation", () => {
    it("should create a valid user", () => {
      const user = User.create(
        "Leonardo Tireck",
        "test@example.com",
        "11144477735",
        "11987654321",
        new Date("1990-01-01"),
        "hashedPassword123",
        activePlan,
        "client",
      );

      expect(user.id).toBeDefined();
      expect(typeof user.id).toBe("string");
      expect(user.name).toBe("Leonardo Tireck");
      expect(user.email).toBe("test@example.com");
      expect(user.documentCPF).toBe("11144477735");
      expect(user.phone).toBe("11987654321");
      expect(user.hashedPassword).toBe("hashedPassword123");
      expect(user.activePlan).toBe(activePlan);
      expect(user.userType).toBe("client");
      expect(user.pastPlans).toEqual([]);
      expect(user.trainingSessions).toEqual([]);
    });

    it("should throw an error for an invalid name", () => {
      expect(() =>
        User.create(
          "Invalid", // Invalid name
          "test@example.com",
          "11144477735",
          "11987654321",
          new Date("1990-01-01"),
          "hashedPassword123",
          activePlan,
          "client",
        ),
      ).toThrow("Name does not meet criteria.");
    });

    it("should throw an error for an invalid email", () => {
      expect(() =>
        User.create(
          "Leonardo Tireck",
          "invalid-email", // Invalid email
          "11144477735",
          "11987654321",
          new Date("1990-01-01"),
          "hashedPassword123",
          activePlan,
          "client",
        ),
      ).toThrow("Email does not meet criteria.");
    });

    it("should throw an error for an invalid document (CPF)", () => {
      expect(() =>
        User.create(
          "Leonardo Tireck",
          "test@example.com",
          "12345", // Invalid CPF
          "11987654321",
          new Date("1990-01-01"),
          "hashedPassword123",
          activePlan,
          "client",
        ),
      ).toThrow("Document does not meet criteria.");
    });

    it("should throw an error for an invalid phone number", () => {
      expect(() =>
        User.create(
          "Leonardo Tireck",
          "test@example.com",
          "11144477735",
          "12345", // Invalid phone
          new Date("1990-01-01"),
          "hashedPassword123",
          activePlan,
          "client",
        ),
      ).toThrow("Phone does not meet criteria.");
    });
  });

  describe("User Updates", () => {
    it("should update email and phone", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );
      const newEmail = "b@b.com";
      const newPhone = "21987654321";

      user.updateEmail(newEmail);
      user.updatePhone(newPhone);

      expect(user.email).toBe(newEmail);
      expect(user.phone).toBe(newPhone);
    });

    it("should update PARQ and last update date", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );
      const newParq = Parq.create(["q1"], ["a1"]);

      user.updateParq(newParq);

      expect(user.parq).toBe(newParq);
      expect(user.lastParqUpdate).toBeDefined();
      expect(user.lastParqUpdate).toBeInstanceOf(Date);
    });

    it("should throw an error when updating PARQ with an invalid value", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );
      expect(() => user.updateParq(null as any)).toThrow("Invalid Parq");
    });
  });

  describe("Plan Management", () => {
    it("should not move a non-expired plan to past plans", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );

      user.refreshPlans();

      expect(user.activePlan).toBe(activePlan);
      expect(user.pastPlans.length).toBe(0);
    });

    it("should move an expired plan to past plans", () => {
      const expiredPlan = TrainingPlan.create("silver", "card");
      expiredPlan.expirationDate = new Date("2020-01-01"); // Expired date

      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        expiredPlan,
        "client",
      );

      user.refreshPlans();

      expect(user.activePlan).toBeUndefined();
      expect(user.pastPlans.length).toBe(1);
      expect(user.pastPlans[0]).toBe(expiredPlan);
    });

    it("should throw an error when refreshing plans if there is no active plan", () => {
      const user = new User(
        "user-id",
        "client",
        "Leo Tireck",
        new Date(),
        "11144477735",
        new Date(),
        "a@a.com",
        "11987654321",
        "pass",
        undefined, // explicitly create user with no active plan
      );

      expect(() => user.refreshPlans()).toThrow("There isn't an active plan.");
    });

    it("should update the active plan", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );
      const newPlan = TrainingPlan.create("silver", "PIX");

      user.updateActivePlan(newPlan);

      expect(user.activePlan).toBe(newPlan);
    });
  });

  describe("Training Session Management", () => {
    it("should add a new training session", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );
      const trainingSession = TrainingSession.create("A", [{ name: "Push-ups", sets: [{ orderNumber: 1, reps: 10, weight: 0 }], notes: "", restInSeconds: 0, videoUrl: "" }]);
      user.addTrainingSession(trainingSession);
      expect(user.trainingSessions.length).toBe(1);
      expect(user.trainingSessions[0]).toBe(trainingSession);
    });

    it("should update training sessions", () => {
      const user = User.create(
        "Leo Tireck",
        "a@a.com",
        "11144477735",
        "11987654321",
        new Date(),
        "pass",
        activePlan,
        "client",
      );
      const trainingSession1 = TrainingSession.create("A", [{ name: "Push-ups", sets: [{ orderNumber: 1, reps: 10, weight: 0 }], notes: "", restInSeconds: 0, videoUrl: "" }]);
      const trainingSession2 = TrainingSession.create("B", [{ name: "Squats", sets: [{ orderNumber: 1, reps: 10, weight: 0 }], notes: "", restInSeconds: 0, videoUrl: "" }]);
      user.updateTrainingSessions([trainingSession1, trainingSession2]);
      expect(user.trainingSessions.length).toBe(2);
      expect(user.trainingSessions[0]).toBe(trainingSession1);
      expect(user.trainingSessions[1]).toBe(trainingSession2);
    });
  });
});
