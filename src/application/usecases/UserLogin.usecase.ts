import { UserRepository } from '../ports/UserRepository';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import PasswordHasher from '../ports/PasswordHasher';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/Types';
import { UnauthorizedError } from '../errors/AppError';
import { ConfigService } from '../../infrastructure/config/ConfigService';
import { RefreshTokenRepository } from '../ports/RefreshTokenRepository';

@injectable()
export class UserLogin {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepo: UserRepository,
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepo: RefreshTokenRepository,
    @inject(TYPES.PasswordHasher)
    private passwordHasher: PasswordHasher,
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
  ) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = await this.userRepo.getByEmail(input.email);
    if (!user) throw new UnauthorizedError('Invalid Credentials.');
    const passwordMatch = await this.passwordHasher.compare(
      input.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new UnauthorizedError('Invalid Credentials.');

    const accessToken = jwt.sign({ id: user.id }, this.configService.jwtAccessSecret, {
      expiresIn: 60 * 5,
      subject: 'accessToken',
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      this.configService.jwtRefreshSecret,
      { subject: 'refreshToken', expiresIn: '1w' },
    );

    await this.refreshTokenRepo.save(refreshToken, user.id);

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

