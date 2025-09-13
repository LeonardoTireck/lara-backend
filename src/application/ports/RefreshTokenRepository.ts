export interface RefreshTokenRepository {
  save(token: string, userId: string): Promise<void>;
  getById(userId: string): Promise<string>;
  delete(userId: string): Promise<void>;
}
