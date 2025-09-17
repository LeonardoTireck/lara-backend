import { ConfigService } from '../../../../src/infrastructure/config/ConfigService';

describe('ConfigService', () => {
  const originalEnv = process.env;

  const requiredVars = {
    PORT: '3000',
    AWS_REGION: 'us-east-1',
    AWS_ACCESS_KEY_ID: 'test_key_id',
    AWS_SECRET_ACCESS_KEY: 'test_secret_key',
    JWT_ACCESS_SECRET: 'test_jwt_access_secret',
    JWT_REFRESH_SECRET: 'test_jwt_refresh_secret',
    SECURE_COOKIE: 'true',
    BCRYPT_SALTROUNDS: '1',
  };

  beforeEach(() => {
    // Reset the process.env to a clean state for each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  describe('Constructor', () => {
    it('should not throw an error if all required environment variables are set', () => {
      process.env = {
        ...process.env,
        ...requiredVars,
      };
      expect(() => new ConfigService()).not.toThrow();
    });

    it('should throw an error if a required environment variable is missing', () => {
      process.env = {
        ...process.env,
        ...requiredVars,
      };
      delete process.env.PORT; // Remove one required variable
      expect(() => new ConfigService()).toThrow(
        'Missing required environment varible: PORT',
      );
    });
  });

  describe('Getters', () => {
    beforeEach(() => {
      // Set all required env vars for getter tests
      process.env = {
        ...process.env,
        ...requiredVars,
      };
    });

    it('should return the correct port from environment variables', () => {
      process.env.PORT = '8080';
      const configService = new ConfigService();
      expect(configService.port).toBe(8080);
    });

    it('should return default port 3001 if PORT is not a valid number', () => {
      process.env.PORT = 'not-a-number'; // Number('not-a-number') is NaN
      const configService = new ConfigService();
      expect(configService.port).toBe(3001);
    });

    it('should return the correct saltrounds from environment variables', () => {
      process.env.BCRYPT_SALTROUNDS = '12';
      const configService = new ConfigService();
      expect(configService.saltrounds).toBe(12);
    });

    it('should return default saltrounds 1 if BCRYPT_SALTROUNDS is not a valid number', () => {
      process.env.BCRYPT_SALTROUNDS = 'not-a-number';
      const configService = new ConfigService();
      expect(configService.saltrounds).toBe(1);
    });

    it('should return the correct ddbEndpoint', () => {
      process.env.DDB_ENDPOINT = 'http://localhost:8000';
      const configService = new ConfigService();
      expect(configService.ddbEndpoint).toBe('http://localhost:8000');
    });

    it('should return the correct jwtAccessSecret', () => {
      const configService = new ConfigService();
      expect(configService.jwtAccessSecret).toBe('test_jwt_access_secret');
    });

    it('should return the correct jwtRefreshSecret', () => {
      const configService = new ConfigService();
      expect(configService.jwtRefreshSecret).toBe('test_jwt_refresh_secret');
    });

    it('should return the correct awsRegion', () => {
      const configService = new ConfigService();
      expect(configService.awsRegion).toBe('us-east-1');
    });

    it('should return the correct awsAccessKeyId', () => {
      const configService = new ConfigService();
      expect(configService.awsAccessKeyId).toBe('test_key_id');
    });

    it('should return the correct awsSecretAccessKey', () => {
      const configService = new ConfigService();
      expect(configService.awsSecretAccessKey).toBe('test_secret_key');
    });

    it('should return true for secureCookie when SECURE_COOKIE is "true"', () => {
      process.env.SECURE_COOKIE = 'true';
      const configService = new ConfigService();
      expect(configService.secureCookie).toBe(true);
    });

    it('should return false for secureCookie when SECURE_COOKIE is not "true"', () => {
      process.env.SECURE_COOKIE = 'false';
      const configService = new ConfigService();
      expect(configService.secureCookie).toBe(false);

      process.env.SECURE_COOKIE = 'any_other_string';
      const configService2 = new ConfigService();
      expect(configService2.secureCookie).toBe(false);
    });
  });
});
