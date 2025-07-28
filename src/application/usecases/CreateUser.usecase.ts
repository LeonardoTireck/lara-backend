import PasswordHasher from "../ports/PasswordHasher";
import { TrainingPlan } from "../../domain/TrainingPlan";
import { User } from "../../domain/User";
import { UserRepository } from "../ports/UserRepository";
import { UserType } from "../../domain/UserType";
import { validatePassword } from "../../domain/ValidatePassword";

export class CreateUser {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!validatePassword(input.password))
      throw new Error("Password does not meet criteria.");

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const user = User.create(
      input.name,
      input.email,
      input.documentCPF,
      input.phone,
      input.dateOfBirth,
      hashedPassword,
      input.activePlan,
      input.userType,
    );

    await this.userRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
type Input = {
  name: string;
  email: string;
  password: string;
  documentCPF: string;
  phone: string;
  dateOfBirth: Date;
  activePlan: TrainingPlan;
  userType: UserType;
};

type Output = {
  id: string;
  name: string;
  email: string;
};
