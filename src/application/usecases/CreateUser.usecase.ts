import PasswordHasher from "../ports/PasswordHasher";
import { TrainingPlan } from "../../domain/TrainingPlan";
import { User } from "../../domain/User";
import { UserRepository } from "../ports/UserRepository";
import { UserType } from "../../domain/UserType";
import { Password } from "../../domain/Password";

export class CreateUser {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    const newPassword = new Password(input.password).value;
    const hashedPassword = await this.passwordHasher.hash(newPassword);

    const user = User.create(
      input.name,
      input.email,
      input.documentCPF,
      input.phone,
      new Date(input.dateOfBirth),
      hashedPassword,
      input.activePlan,
      input.userType || "client",
    );

    await this.userRepo.save(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      activePlan: user.activePlan,
    };
  }
}
interface Input {
  name: string;
  email: string;
  password: string;
  documentCPF: string;
  phone: string;
  dateOfBirth: Date;
  activePlan: TrainingPlan;
  userType?: UserType;
}

interface Output {
  id: string;
  name: string;
  email: string;
  activePlan?: TrainingPlan;
}
