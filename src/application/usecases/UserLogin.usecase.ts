import { UserRepository } from "../ports/UserRepository";
import jwt from "jsonwebtoken";
import "dotenv/config";
import PasswordHasher from "../ports/PasswordHasher";

export class UserLogin {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.userRepo.getByEmail(input.email);
    if (!user) throw new Error("Invalid Credentials.");
    const passwordMatch = await this.passwordHasher.compare(
      input.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new Error("Invalid Credentials.");

    const payload = {
      id: user.id,
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
