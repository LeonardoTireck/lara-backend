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
    readonly documentCPF: string,
    readonly phone: string,
    readonly dateOfBirth: Date,
    readonly hashedPassword: string,
    readonly dateOfFirstPlanIngress: Date,
    readonly activePlan: TrainingPlan,
    readonly pastPlans: TrainingPlan[] | undefined,
    readonly parq: Parq | undefined,
    readonly lastParqUpdate: Date | undefined,
    readonly trainingSessions: TrainingSession[] | undefined,
  ) {}

  static create(
    name: string,
    email: string,
    documentCPF: string,
    phone: string,
    dateOfBirth: Date,
    hashedPassword: string,
    activePlan: TrainingPlan,
    userType: UserType,
    dateOfFirstPlanIngress?: Date,
  ) {
    const id = crypto.randomUUID();
    return new User(
      id,
      userType,
      name,
      email,
      documentCPF,
      phone,
      dateOfBirth,
      hashedPassword,
      dateOfFirstPlanIngress || new Date(),
      activePlan,
      undefined,
      undefined,
      undefined,
      undefined,
    );
  }
}
