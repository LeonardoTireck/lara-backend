import { UserRepository } from "../domain/UserRepository";

export class FindUserById {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.findById(input.userId);

    if (!user) throw new Error("User not found.");

    const output = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    };
    return output;
  }
}

type Input = {
  userId: string;
};

type Output = {
  id: string;
  name: string;
  email: string;
  password: string;
};
