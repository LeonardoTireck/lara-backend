import { Parq } from "../domain/Parq";
import PasswordHasher from "../domain/PasswordHasher";
import { TrainingPlan } from "../domain/TrainingPlan";
import { TrainingSession } from "../domain/TrainingSession";
import { UserRepository } from "../domain/UserRepository";
import { UserType } from "../domain/UserType";
import { validateBrazilPhone } from "../domain/ValidateBrazilPhone";
import { validateEmail } from "../domain/ValidateEmail";
import { validatePassword } from "../domain/ValidatePassword";
import { FindUserById } from "./FindUserById.usecase";

export class UpdateUserById {
  constructor(
    private UserRepo: UserRepository,
    private PasswordHasher: PasswordHasher,
  ) {}
  async execute(input: Input): Promise<Output> {
    const findUserByIdUsecase = new FindUserById(this.UserRepo);
    const userId = {
      userId: input.id,
    };
    const user = await findUserByIdUsecase.execute(userId);
    if (!user) throw new Error("User not found.");
    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      hashedPassword: user.hashedPassword,
      documentCPF: user.documentCPF,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      userType: user.userType,
      dateOfFirstPlanIngress: user.dateOfFirstPlanIngress,
      // gotta find a way to pass an active and expired plan to pastplans
      activePlan: user.activePlan,
      pastPlans: user.pastPlans,
      // gotta validate lastParqUpdate from the input
      lastParqUpdate: input.lastParqUpdate || user.lastParqUpdate,
      // gotta validate trainingSessions from the input
      trainingSessions: input.trainingSessions || user.trainingSessions,
      parq: input.parq || user.parq,
    };
    if (input.email && input.email != user.email) {
      if (validateEmail(input.email)) {
        updatedUser.email = input.email;
      }
    }
    if (
      input.plainTextPassword &&
      input.plainTextPassword != user.hashedPassword
    ) {
      if (validatePassword(input.plainTextPassword)) {
        updatedUser.hashedPassword = await this.PasswordHasher.hash(
          input.plainTextPassword,
        );
      }
    }
    if (input.phone && input.phone != user.phone) {
      if (validateBrazilPhone(input.phone)) {
        updatedUser.phone = input.phone;
      }
    }
    this.UserRepo.delete(user.id);
    this.UserRepo.save(updatedUser);
    return updatedUser;
  }
}

type Input = {
  id: string;
  email?: string;
  plainTextPassword?: string;
  phone?: string;
  activePlan: TrainingPlan;
  pastPlans?: TrainingPlan[];
  parq?: Parq;
  lastParqUpdate?: Date;
  trainingSessions?: TrainingSession[];
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
  activePlan: TrainingPlan;
  pastPlans: TrainingPlan[] | undefined;
  parq: Parq | undefined;
  lastParqUpdate: Date | undefined;
  trainingSessions: TrainingSession[] | undefined;
};
