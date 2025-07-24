import { Parq } from "../../domain/Parq";
import PasswordHasher from "../../domain/PasswordHasher";
import { TrainingPlan } from "../../domain/TrainingPlan";
import { TrainingSession } from "../../domain/TrainingSession";
import { UserType } from "../../domain/UserType";
import { validateBrazilPhone } from "../../domain/ValidateBrazilPhone";
import { validateEmail } from "../../domain/ValidateEmail";
import { validatePassword } from "../../domain/ValidatePassword";
import { UserRepository } from "../ports/UserRepository";

export class UpdateClientInfo {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}
  async execute(input: Input): Promise<Output> {
    const user = await this.userRepo.getById(input.id);
    if (!user) throw new Error("User not found.");

    return updatedUser;
  }
}

type Input = {
  id: string;
  email?: string;
  plainTextPassword?: string;
  phone?: string;
};

type Output = {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  documentCPF: string;
  phone: string;
  dateOfBirth: Date;
  userType: UserType;
  dateOfFirstPlanIngress: Date;
  activePlan: TrainingPlan | undefined;
  pastPlans: TrainingPlan[] | undefined;
  parq: Parq | undefined;
  lastParqUpdate: Date | undefined;
  trainingSessions: TrainingSession[] | undefined;
};
