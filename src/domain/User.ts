import crypto from "crypto";
import { TrainingSession } from "./TrainingSession";
import { Parq } from "./Parq";
import { UserType } from "./UserType";
import { PlanType } from "./PlanType";

export class User {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly hashedPassword: string,
    readonly phone: string,
    readonly dateOfBirth: Date,
    readonly userType: UserType,
    readonly planType: "silver" | "gold" | "diamond",
    readonly dateOfRegistration: Date,
    readonly expirationDate: Date,
    readonly paymentMethod: "card" | "PIX",
    readonly lastParqUpdate: Date | undefined,
    readonly trainingSessions: TrainingSession[] | undefined,
    readonly parq: Parq | undefined,
  ) {}

  static async create(
    name: string,
    email: string,
    hashedPassword: string,
    phone: string,
    dateOfBirth: Date,
    userType: UserType,
    planType: PlanType,
    paymentMethod: "card" | "PIX",
  ) {
    const id = crypto.randomUUID();
    const dateOfRegistration = new Date();
    let monthsToAdd = 0;
    switch (planType) {
      case "silver":
        monthsToAdd = 1;
        break;
      case "gold":
        monthsToAdd = 3;
        break;
      case "diamond":
        monthsToAdd = 6;
        break;
      default:
        throw new Error(`Invalid planType: ${planType}.`);
    }
    const expirationDate = new Date(dateOfRegistration);
    expirationDate.setMonth(dateOfRegistration.getMonth() + monthsToAdd);
    return new User(
      id,
      name,
      email,
      hashedPassword,
      phone,
      dateOfBirth,
      userType,
      planType,
      dateOfRegistration,
      expirationDate,
      paymentMethod,
      undefined,
      undefined,
      undefined,
    );
  }
}
