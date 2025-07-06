import crypto from "crypto";

export class User {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static create(name: string, email: string, password: string) {
    const id = crypto.randomUUID();
    return new User(id, name, email, password);
  }
}
