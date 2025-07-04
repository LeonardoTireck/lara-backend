export class User {
  private constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static create(name: string, email: string, password: string) {
    return new User(name, email, password);
  }
}
