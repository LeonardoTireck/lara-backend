import { container } from '../../../../src/di/Inversify.config';
import { TYPES } from '../../../../src/di/Types';
import { UserType } from '../../../../src/domain/ValueObjects/UserType';
import { JwtService } from '../../../../src/infrastructure/auth/JwtService';
import { ConfigService } from '../../../../src/infrastructure/config/ConfigService';
import crypto from 'crypto';

describe('JWT service test', () => {
  let jwtService: JwtService;
  let configService: ConfigService;
  beforeAll(() => {
    jwtService = container.get<JwtService>(TYPES.JwtService);
    configService = container.get<ConfigService>(TYPES.ConfigService);
  });
  it('Should create a jwt and return the string and VO', async () => {
    const input = {
      id: crypto.randomUUID(),
      userType: 'client' as UserType,
    };

    const { tokenString, refreshTokenVO } = jwtService.createRefreshToken(
      input.id,
      input.userType,
    );

    expect(tokenString).toBeDefined();
    expect(refreshTokenVO.id).toBe(input.id);
    expect(refreshTokenVO.jti).toBeDefined();
    expect(refreshTokenVO.exp).toBeDefined();
    expect(refreshTokenVO.userType).toBe(input.userType);
  });

  it('Should create a valid AccessToken and return it as a string', async () => {
    const input = {
      id: crypto.randomUUID(),
      userType: 'client' as UserType,
    };

    const tokenString = jwtService.createAccessToken(input.id, input.userType);
    const decodedAccessToken =
      jwtService.decodeAndValidateAccessToken(tokenString);

    expect(decodedAccessToken.id).toBe(input.id);
    expect(decodedAccessToken.jti).toBeDefined();
    expect(decodedAccessToken.userType).toBe(input.userType);
    expect(decodedAccessToken.exp).toBeDefined();
  });

  it('Should decode and validate a refresh token, returning a RefreshTokenVO', async () => {
    const input = {
      id: crypto.randomUUID(),
      userType: 'client' as UserType,
    };
    const { tokenString, refreshTokenVO } = jwtService.createRefreshToken(
      input.id,
      input.userType,
    );
    const decodedRefreshTokenAsRefreshTokenVO =
      jwtService.decodeAndValidateRefreshToken(tokenString);

    expect(decodedRefreshTokenAsRefreshTokenVO.id).toBe(input.id);
    expect(decodedRefreshTokenAsRefreshTokenVO.userType).toBe(input.userType);
    expect(decodedRefreshTokenAsRefreshTokenVO.exp).toBeDefined();
    expect(decodedRefreshTokenAsRefreshTokenVO.jti).toBeDefined();
    expect(refreshTokenVO.id).toBe(input.id);
    expect(refreshTokenVO.userType).toBe(input.userType);
    expect(refreshTokenVO.exp).toBeDefined();
    expect(refreshTokenVO.jti).toBeDefined();
  });
});
