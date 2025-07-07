import { UserRepository } from "../domain/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class UserLogin {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.getByEmail(input.email);
    if (!user) throw new Error("Invalid Credentials.");
    bcrypt.compare(input.password, user.password, (err, same) => {
      if (err) throw err;
      if (!same) throw new Error("Invalid Credentials.");
    });
    const payload = {
      email: user.email,
      name: user.name,
    };

    const output = {
      token: jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      }),
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
