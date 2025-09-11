import { UserRepository } from '../ports/UserRepository';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import PasswordHasher from '../ports/PasswordHasher';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/Types';

@injectable()
export class UserLogin {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepo: UserRepository,
    @inject(TYPES.PasswordHasher)
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.userRepo.getByEmail(input.email);
    if (!user) throw new Error('Invalid Credentials.');
    const passwordMatch = await this.passwordHasher.compare(
      input.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new Error('Invalid Credentials.');

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return { token };
  }
}

interface Input {
  email: string;
  password: string;
}

interface Output {
  token: string;
}
