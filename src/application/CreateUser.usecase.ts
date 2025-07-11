import PasswordHasher from "../domain/PasswordHasher";
import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";
import { UserType } from "../domain/UserType";

export class CreateUser {
  constructor(
    private UserRepo: UserRepository,
    private PasswordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    const hashedPassword = await this.PasswordHasher.hash(input.password);
    const user = await User.create(
      input.name,
      input.email,
      hashedPassword,
      input.phone,
      input.dateOfBirth,
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
  phone: string;
  dateOfBirth: Date;
  userType: UserType;
};

type Output = {
  id: string;
  name: string;
  email: string;
};
