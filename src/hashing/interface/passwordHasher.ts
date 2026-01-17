export default interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(input: string, hashedPassword: string): Promise<boolean>;
}
