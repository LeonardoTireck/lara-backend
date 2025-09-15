import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/Types';
import { RefreshTokenRepository } from '../ports/RefreshTokenRepository';
import jwt from 'jsonwebtoken';
import { ConfigService } from '../../infrastructure/config/ConfigService';
import { UnauthorizedError } from '../errors/AppError';
import PasswordHasher from '../ports/PasswordHasher';

@injectable()
export class RefreshToken {
  constructor(
    @inject(TYPES.RefreshTokenRepository)
    private refreshTokenRepo: RefreshTokenRepository,
    @inject(TYPES.ConfigService)
    private configService: ConfigService,
    @inject(TYPES.PasswordHasher)
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: Input): Promise<Output> {
    const verifiedRefreshToken = jwt.verify(
      input.refreshToken,
      this.configService.jwtRefreshSecret,
    );
    if (
      !verifiedRefreshToken ||
      typeof verifiedRefreshToken === 'string' ||
      !verifiedRefreshToken.id
    ) {
      throw new UnauthorizedError();
    }

    const storedHashedToken = await this.refreshTokenRepo.getById(
      verifiedRefreshToken.id,
    );

    const hashMatch = await this.passwordHasher.compare(
      input.refreshToken,
      storedHashedToken,
    );
    if (!hashMatch) throw new UnauthorizedError('Invalid Credentials.');

    const accessToken = jwt.sign(
      { id: verifiedRefreshToken.id },
      this.configService.jwtAccessSecret,
      {
        expiresIn: 60 * 5,
        subject: 'accessToken',
      },
    );

    const refreshToken = jwt.sign(
      { id: verifiedRefreshToken.id },
      this.configService.jwtRefreshSecret,
      { subject: 'refreshToken', expiresIn: '1w' },
    );

    const hashedRefreshToken = await this.passwordHasher.hash(refreshToken);

    await this.refreshTokenRepo.save(
      hashedRefreshToken,
      verifiedRefreshToken.id,
    );

    return { accessToken, refreshToken };
  }
}

interface Input {
  refreshToken: string;
}

interface Output {
  accessToken: string;
  refreshToken: string;
}
