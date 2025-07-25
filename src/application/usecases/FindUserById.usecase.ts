import { Parq } from "../../domain/Parq";
import { TrainingPlan } from "../../domain/TrainingPlan";
import { TrainingSession } from "../../domain/TrainingSession";
import { UserRepository } from "../ports/UserRepository";
import { UserType } from "../../domain/UserType";

export class FindUserById {
  constructor(private userRepo: UserRepository) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepo.getById(input.userId);
    if (!user) throw new Error("User not found.");

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      documentCPF: user.documentCPF,
      phone: user.phone,
      password: user.hashedPassword,
      dateOfBirth: user.dateOfBirth,
      userType: user.userType,
      dateOfFirstPlanIngress: user.dateOfFirstPlanIngress,
      activePlan: user.activePlan,
      pastPlans: user.pastPlans,
      lastParqUpdate: user.lastParqUpdate,
      trainingSessions: user.trainingSessions,
      parq: user.parq,
    };
  }
}

type Input = {
  userId: string;
};

type Output = {
  id: string;
  name: string;
  email: string;
  documentCPF: string;
  phone: string;
  password: string;
  dateOfBirth: Date;
  userType: UserType;
  dateOfFirstPlanIngress: Date;
  activePlan?: TrainingPlan;
  pastPlans: TrainingPlan[] | [];
  lastParqUpdate?: Date;
  trainingSessions: TrainingSession[] | [];
  parq?: Parq;
};
