import { PlanType } from "./PlanType";

export class TrainingPlan {
  private constructor(
    readonly planType: PlanType,
    readonly paymentMethod: "card" | "PIX",
  ) {}

  static create(planType: PlanType, paymentMethod: "card" | "PIX") {
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
    const startDate = new Date();
    const expirationDate = new Date(startDate);
    expirationDate.setMonth(startDate.getMonth() + monthsToAdd);
    return new TrainingPlan(planType, paymentMethod);
  }
}
