import { injectable } from 'inversify';
import { NotFoundError } from '../../application/errors/AppError';
import { RefreshTokenRepository } from '../../application/ports/RefreshTokenRepository';

@injectable()
export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  public tokens: { token: string; userId: string }[] = [];

  async save(token: string, userId: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex((t) => t.userId === userId);

    if (tokenIndex !== -1) {
      this.tokens[tokenIndex] = { token, userId };
    } else {
      this.tokens.push({ token, userId });
    }
  }

  async getById(userId: string): Promise<string> {
    const retrievedToken = this.tokens.find((t) => t.userId === userId);
    if (!retrievedToken) {
      throw new NotFoundError('Token not found');
    }
    return retrievedToken.token;
  }

  async delete(userId: string): Promise<void> {
    const tokenIndex = this.tokens.findIndex((t) => t.userId === userId);
    if (tokenIndex === -1) {
      throw new NotFoundError('Token not found');
    }
    this.tokens.splice(tokenIndex, 1);
  }
}