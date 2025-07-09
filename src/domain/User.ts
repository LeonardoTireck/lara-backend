import crypto from "crypto";

export class User {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly hashedPassword: string,
  ) {}

  static async create(name: string, email: string, hashedPassword: string) {
    const id = crypto.randomUUID();
    return new User(id, name, email, hashedPassword);
  }
}
