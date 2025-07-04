import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class CreateUser {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output> {
    const user = User.create(input.id, input.name, input.email, input.password);

    await this.UserRepo.save(user);
    return user;
  }
}
type Input = {
  id: string;
  name: string;
  email: string;
  password: string;
};

type Output = {
  id: string;
  name: string;
  email: string;
  password: string;
};
