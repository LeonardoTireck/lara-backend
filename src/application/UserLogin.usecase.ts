import { UserRepository } from "../domain/UserRepository";
import bcrypt from "bcrypt";

export class UserLogin {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.getByEmail(input.email);
    if (!user) throw new Error("Invalid Credentials.");
    bcrypt.compare(input.password, user.password, (err, same) => {
      if (err) throw err;
      if (!same) throw new Error("Invalid Credentials.");
    });
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
