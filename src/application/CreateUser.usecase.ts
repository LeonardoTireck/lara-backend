import PasswordHasher from "../domain/PasswordHasher";
import { TrainingPlan } from "../domain/TrainingPlan";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserType } from "../domain/UserType";
import { validateEmail } from "../domain/ValidateEmail";
import { validatePassword } from "../domain/ValidatePassword";
import { validateCPF } from "../domain/ValidateCPF";
import { validateBrazilPhone } from "../domain/ValidateBrazilPhone";

export class CreateUser {
  constructor(
    private UserRepo: UserRepository,
    private PasswordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    if (!validateEmail(input.email))
      throw new Error("Email does not meet criteria.");
    if (!validatePassword(input.password))
      throw new Error("Password does not meet criteria.");
    if (!validateCPF(input.documentCPF))
      throw new Error("Document does not meet criteria.");
    if (!validateBrazilPhone(input.phone))
      throw new Error("Phone does not meet criteria.");
    const hashedPassword = await this.PasswordHasher.hash(input.password);
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

    await this.UserRepo.save(user);
    const output = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return output;
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
