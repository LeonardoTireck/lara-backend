export interface RefreshTokenRepository {
  add(jti: string, tokenExpiresIn: number): Promise<void>;
  exists(jti: string): Promise<boolean>;
}
