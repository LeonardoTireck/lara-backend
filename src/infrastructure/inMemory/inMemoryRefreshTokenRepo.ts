import { injectable } from 'inversify';
import { RefreshTokenRepository } from '../../application/ports/RefreshTokenRepository';

@injectable()
export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  private refreshTokens = new Map<string, number>();

  async add(jti: string, tokenExpiresIn: number): Promise<void> {
    this.refreshTokens.set(jti, tokenExpiresIn);
  }

  async exists(jti: string): Promise<boolean> {
    return this.refreshTokens.has(jti);
  }
}

