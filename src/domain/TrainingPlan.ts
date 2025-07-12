export class TrainingPlan {
  constructor(
    readonly planType: "silver" | "gold" | "diamond",
    readonly startDate: Date = new Date(),
    readonly expirationDate: Date,
    readonly paymentMethod: "card" | "PIX",
  ) {
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
    this.expirationDate = new Date(this.startDate);
    expirationDate.setMonth(this.startDate.getMonth() + monthsToAdd);
  }
}
