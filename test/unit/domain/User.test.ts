import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import { User } from "../../../src/domain/User";

test("Should create a user", async () => {
  const input = {
    name: "Leonardo Tireck",
    email: "johndoe@test.com",
    documentCPF: "05689364932",
    phone: "47992000622",
    dateOfBirth: new Date(),
    hashedPassword: "kjfashdfkjsadhfak3419853@@@sgfjsd",
    activePlan: TrainingPlan.create("diamond", "card"),
    userType: "client",
  } as const;

  const user = User.create(
    input.name,
    input.email,
    input.documentCPF,
    input.phone,
    input.dateOfBirth,
    input.hashedPassword,
    input.activePlan,
    input.userType,
  );

  expect(user.id).toBeDefined();
  expect(user.userType).toBe("client");
  expect(user.name).toBe("Leonardo Tireck");
  expect(user.documentCPF).toBe("05689364932");
  expect(user.phone).toBe("47992000622");
  expect(user.dateOfBirth).toBe(input.dateOfBirth);
  expect(user.email).toBe("johndoe@test.com");
  expect(user.hashedPassword).toBe("kjfashdfkjsadhfak3419853@@@sgfjsd");
  expect(user.activePlan).toBe(input.activePlan);
});
