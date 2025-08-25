import "dotenv/config";
import { TrainingPlan } from "../../../src/domain/TrainingPlan";
import axios from "axios";

test("Should create a user using express and dynamodb", async () => {
  const input = {
    name: "Leonardo Tireck",
    email: "leo@test.com",
    documentCPF: "987.654.321-00",
    phone: "+5547992000622",
    dateOfBirth: new Date(),
    password: "Test123@",
    activePlan: TrainingPlan.create("silver", "PIX"),
  } as const;

  const outputHttpCreateUser = await axios.post(
    "http://localhost:3000/newUser",
    input,
  );

  expect(outputHttpCreateUser.data.name).toBe(input.name);
  expect(outputHttpCreateUser.data.email).toBe(input.email);
});
