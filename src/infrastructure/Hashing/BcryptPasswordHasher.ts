import bcrypt from "bcrypt";
import PasswordHasher from "../../application/ports/PasswordHasher";

export default class BcryptPasswordHasher implements PasswordHasher {
  constructor(private saltRounds: number) {}
  async hash(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }
  async compare(input: string, hashedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(input, hashedPassword);
    return match;
  }
}
