import { injectable } from 'inversify';
import 'dotenv/config';

@injectable()
export class ConfigService {
  constructor() {
    const requiredVars = [
      'PORT',
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
    ];
    for (const requiredVar of requiredVars) {
      if (!process.env[requiredVar]) {
        throw new Error(`Missing required environment varible: ${requiredVar}`);
      }
    }
  }

  get port(): number {
    return Number(process.env.PORT) || 3001;
  }

  get saltrounds(): number {
    return Number(process.env.BCRYPT_SALTROUNDS!) || 1;
  }

  get ddbEndpoint(): string {
    return process.env.DDB_ENDPOINT!;
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET!;
  }

  get awsRegion(): string {
    return process.env.AWS_REGION!;
  }

  get awsAccessKeyId(): string {
    return process.env.AWS_ACCESS_KEY_ID!;
  }

  get awsSecretAccessKey(): string {
    return process.env.AWS_SECRET_ACCESS_KEY!;
  }
}
