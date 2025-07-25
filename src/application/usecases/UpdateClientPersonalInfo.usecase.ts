import PasswordHasher from "../ports/PasswordHasher";
import { validatePassword } from "../../domain/ValidatePassword";
import { UserRepository } from "../ports/UserRepository";

export class UpdateClientPersonalInfo {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}
  async execute(input: Input): Promise<void> {
    const user = await this.userRepo.getById(input.id);
    if (!user) throw new Error("User not found.");

    if (input.email) {
      user.updateEmail(input.email);
    }
    if (input.phone) {
      user.updatePhone(input.phone);
    }
    if (input.plainTextPassword) {
      if (!validatePassword(input.plainTextPassword))
        throw new Error("Password does not meet criteria.");
      const newHashedPassword = await this.passwordHasher.hash(
        input.plainTextPassword,
      );
      user.updatePassword(newHashedPassword);
    }
    this.userRepo.update(user);
  }
}

type Input = {
  id: string;
  email?: string;
  plainTextPassword?: string;
  phone?: string;
};
