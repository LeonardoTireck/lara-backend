import { UserRepository } from "../ports/UserRepository";
import jwt from "jsonwebtoken";
import "dotenv/config";
import PasswordHasher from "../../domain/PasswordHasher";

export class UserLogin {
  constructor(
    private UserRepo: UserRepository,
    private PasswordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.UserRepo.getByEmail(input.email);
    if (!user) throw new Error("Invalid Credentials.");
    const passwordMatch = await this.PasswordHasher.compare(
      input.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new Error("Invalid Credentials.");

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
