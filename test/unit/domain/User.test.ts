import { Parq } from "../../../src/domain/Parq";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import { User } from "../../../src/domain/User";

describe("User Entity", () => {
  let activePlan: TrainingPlan;

  beforeEach(() => {
    activePlan = TrainingPlan.create("gold", "card");
  });

  it("should create a valid user", () => {
    const user = User.create(
      "Leonardo Tireck",
      "test@example.com",
      "11144477735",
      "11987654321",
      new Date("1990-01-01"),
      "hashedPassword123",
      activePlan,
      "client"
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

  it("should update email and phone", () => {
    const user = User.create("Leo Tireck", "a@a.com", "11144477735", "11987654321", new Date(), "pass", activePlan, "client");
    const newEmail = "b@b.com";
    const newPhone = "21987654321";

    user.updateEmail(newEmail);
    user.updatePhone(newPhone);

    expect(user.email).toBe(newEmail);
    expect(user.phone).toBe(newPhone);
  });

  it("should update PARQ and last update date", () => {
    const user = User.create("Leo Tireck", "a@a.com", "11144477735", "11987654321", new Date(), "pass", activePlan, "client");
    const newParq = Parq.create(["q1"], ["a1"]);

    user.updateParq(newParq);

    expect(user.parq).toBe(newParq);
    expect(user.lastParqUpdate).toBeDefined();
    expect(user.lastParqUpdate).toBeInstanceOf(Date);
  });

  it("should not move a non-expired plan to past plans", () => {
    const user = User.create("Leo Tireck", "a@a.com", "11144477735", "11987654321", new Date(), "pass", activePlan, "client");
    
    user.refreshPlans();

    expect(user.activePlan).toBe(activePlan);
    expect(user.pastPlans.length).toBe(0);
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
      undefined // explicitly create user with no active plan
    );

    expect(() => user.refreshPlans()).toThrow("There isn't an active plan.");
  });

  it("should update the active plan", () => {
    const user = User.create("Leo Tireck", "a@a.com", "11144477735", "11987654321", new Date(), "pass", activePlan, "client");
    const newPlan = TrainingPlan.create("silver", "PIX");

    user.updateActivePlan(newPlan);

    expect(user.activePlan).toBe(newPlan);
  });
});