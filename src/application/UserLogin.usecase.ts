import { UserRepository } from "../domain/UserRepository";

export class UserLogin {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.findByEmail(input.email);
    if (!user) throw new Error("Invalid Credentials.");
    if (input.password != user.password)
      throw new Error("Invalid Credentials.");

    const output = {
      token: `You logged in successfully, ${user.name}.`,
    };
    return output;
  }
}

type Input = {
  email: string;
  password: string;
};

type Output = {
  token: string;
};
