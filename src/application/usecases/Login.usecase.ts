import crypto from 'crypto';
import 'dotenv/config';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { TYPES } from '../../di/Types';
import { ConfigService } from '../../infrastructure/config/ConfigService';
import { UnauthorizedError } from '../errors/AppError';
import PasswordHasher from '../ports/PasswordHasher';
import { UserRepository } from '../ports/UserRepository';

@injectable()
export class Login {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepo: UserRepository,
    @inject(TYPES.PasswordHasher)
    private passwordHasher: PasswordHasher,
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepo.getByEmail(input.email);
    if (!user) throw new UnauthorizedError('Invalid Credentials.');
    const passwordMatch = await this.passwordHasher.compare(
      input.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new UnauthorizedError('Invalid Credentials.');

    const accessToken = jwt.sign(
      { id: user.id, userType: user.userType },
      this.configService.jwtAccessSecret,
      {
        expiresIn: 60 * 5,
        subject: 'accessToken',
        jwtid: crypto.randomUUID(),
      },
    );

    const refreshToken = jwt.sign(
      { id: user.id, userType: user.userType },
      this.configService.jwtRefreshSecret,
      { subject: 'refreshToken', expiresIn: '1w', jwtid: crypto.randomUUID() },
    );

    return { name: user.name, accessToken, refreshToken };
  }
}

interface Input {
  email: string;
  password: string;
}

interface Output {
  name: string;
  accessToken: string;
  refreshToken: string;
}
