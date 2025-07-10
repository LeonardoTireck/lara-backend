import { Parq } from "../domain/Parq";
import { PlanType } from "../domain/PlanType";
import { TrainingSession } from "../domain/TrainingSession";
import { UserRepository } from "../domain/UserRepository";
import { UserType } from "../domain/UserType";

export class FindUserById {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.getById(input.userId);
    if (!user) throw new Error("User not found.");

    const output = {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      userType: user.userType,
      planType: user.planType,
      dateOfRegistration: user.dateOfRegistration,
      expirationDate: user.expirationDate,
      paymentMethod: user.paymentMethod,
      lastParqUpdate: user.lastParqUpdate,
      trainingSessions: user.trainingSessions,
      parq: user.parq,
    };
    return output;
  }
}

type Input = {
  userId: string;
};

type Output = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  phone: string;
  dateOfBirth: Date;
  userType: UserType;
  planType: PlanType;
  dateOfRegistration: Date;
  expirationDate: Date;
  paymentMethod: "card" | "PIX";
  lastParqUpdate: Date | undefined;
  trainingSessions: TrainingSession[] | undefined;
  parq: Parq | undefined;
};
