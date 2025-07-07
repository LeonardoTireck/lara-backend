import { UserRepository } from "../domain/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

export class UserLogin {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.getByEmail(input.email);
    if (!user) throw new Error("Invalid Credentials.");

    const same = await bcrypt.compare(input.password, user.password);
    if (!same) throw new Error("Invalid Credentials.");

    const payload = {
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    return { token };
  }
}

type Input = {
  email: string;
  password: string;
};

type Output = {
  token: string;
};
