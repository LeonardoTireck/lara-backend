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
    const decodedRefreshToken = jwt.verify(
      input.refreshToken,
      this.configService.jwtRefreshSecret,
    );
    if (
      !decodedRefreshToken ||
      typeof decodedRefreshToken === 'string' ||
      !decodedRefreshToken.id
    ) {
      throw new UnauthorizedError();
    }

    const storedHashedToken = await this.refreshTokenRepo.getById(
      decodedRefreshToken.id,
    );

    const hashMatch = await this.passwordHasher.compare(
      input.refreshToken,
      storedHashedToken,
    );
    if (!hashMatch) throw new UnauthorizedError('Invalid Credentials.');

    const accessToken = jwt.sign(
      { id: decodedRefreshToken.id },
      this.configService.jwtAccessSecret,
      {
        expiresIn: 60 * 5,
        subject: 'accessToken',
      },
    );

    const refreshToken = jwt.sign(
      { id: decodedRefreshToken.id },
      this.configService.jwtRefreshSecret,
      { subject: 'refreshToken', expiresIn: '1w' },
    );

    const hashedRefreshToken = await this.passwordHasher.hash(refreshToken);

    await this.refreshTokenRepo.save(
      hashedRefreshToken,
      decodedRefreshToken.id,
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
