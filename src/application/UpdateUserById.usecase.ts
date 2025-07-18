import { Parq } from "../domain/Parq";
import PasswordHasher from "../domain/PasswordHasher";
import { TrainingPlan } from "../domain/TrainingPlan";
import { TrainingSession } from "../domain/TrainingSession";
import { UserRepository } from "../domain/UserRepository";
import { UserType } from "../domain/UserType";
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
      email: input.email || user.email,
      hashedPassword: user.hashedPassword,
      phone: input.phone || user.phone,
      dateOfBirth: user.dateOfBirth,
      userType: user.userType,
      dateOfFirstPlanIngress: user.dateOfFirstPlanIngress,
      activePlan: user.activePlan,
      pastPlans: user.pastPlans,
      lastParqUpdate: input.lastParqUpdate || user.lastParqUpdate,
      trainingSessions: input.trainingSessions || user.trainingSessions,
      parq: input.parq || user.parq,
    };
    if (
      input.plainTextPassword &&
      input.plainTextPassword != user.hashedPassword
    ) {
      updatedUser.hashedPassword = await this.PasswordHasher.hash(
        input.plainTextPassword,
      );
    }
    if (!updatedUser.activePlan) {
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
  activePlan?: TrainingPlan;
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
