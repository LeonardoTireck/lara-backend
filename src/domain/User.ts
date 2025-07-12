import crypto from "crypto";
import { TrainingSession } from "./TrainingSession";
import { Parq } from "./Parq";
import { UserType } from "./UserType";
import { TrainingPlan } from "./TrainingPlan";

export class User {
  private constructor(
    readonly id: string,
    readonly userType: UserType,
    readonly name: string,
    readonly email: string,
    readonly phone: string,
    readonly dateOfBirth: Date,
    readonly hashedPassword: string,
    readonly dateOfFirstPlanIngress: Date,
    readonly activePlan: TrainingPlan | undefined,
    readonly pastPlans: TrainingPlan[] | undefined,
    readonly parq: Parq | undefined,
    readonly lastParqUpdate: Date | undefined,
    readonly trainingSessions: TrainingSession[] | undefined,
  ) {}

  static async create(
    name: string,
    email: string,
    hashedPassword: string,
    phone: string,
    dateOfBirth: Date,
    userType: UserType,
  ) {
    const id = crypto.randomUUID();
    return new User(
      id,
      userType,
      name,
      email,
      phone,
      dateOfBirth,
      hashedPassword,
      new Date(),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }
}
