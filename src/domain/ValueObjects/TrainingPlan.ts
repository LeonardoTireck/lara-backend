import { ValidationError } from '../../application/errors/AppError';
import { PlanType } from './PlanType';

export class TrainingPlan {
  public startDate: Date;
  public expirationDate: Date;
  private constructor(
    readonly planType: PlanType,
    readonly paymentMethod: 'card' | 'PIX',
  ) {
    let monthsToAdd = 0;
    switch (planType) {
      case 'silver':
        monthsToAdd = 1;
        break;
      case 'gold':
        monthsToAdd = 3;
        break;
      case 'diamond':
        monthsToAdd = 6;
        break;
      default:
        throw new ValidationError(`Invalid planType: ${planType}.`);
    }
    this.startDate = new Date();
    this.expirationDate = new Date(this.startDate);
    this.expirationDate.setMonth(this.startDate.getMonth() + monthsToAdd);
  }

  static create(planType: PlanType, paymentMethod: 'card' | 'PIX') {
    return new TrainingPlan(planType, paymentMethod);
  }
  static fromRaw(data: any): TrainingPlan {
    if (!data) return data;
    const newTrainingPlan = new TrainingPlan(data.planType, data.paymentMethod);
    newTrainingPlan.startDate = data.startDate;
    newTrainingPlan.expirationDate = data.expirationDate;
    return newTrainingPlan;
  }
}
