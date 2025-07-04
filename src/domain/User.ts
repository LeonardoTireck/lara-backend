export class User {
  private constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ) {}

  static create(id: string, name: string, email: string, password: string) {
    return new User(id, name, email, password);
  }
}
