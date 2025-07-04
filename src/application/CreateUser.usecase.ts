import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class CreateUser {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: { name: string; email: string; password: string }) {
    const user = User.create(input.name, input.email, input.password);

    await this.UserRepo.save(user);
    return user;
  }
}
