import crypto from "crypto";
import bcrypt from "bcrypt";
import "dotenv/config";

export class User {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static async create(name: string, email: string, password: string) {
    const id = crypto.randomUUID();
    const saltRounds = +process.env.BCRYPT_SALTROUNDS!;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return new User(id, name, email, hashedPassword);
  }
}
