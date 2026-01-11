import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import 'dotenv/config';
import { inject, injectable } from 'inversify';
import { RefreshTokenRepository } from '../../../application/ports/refreshTokenRepository';
import { TYPES } from '../../../di/types';

@injectable()
export class DynamoDbRefreshTokensRepo implements RefreshTokenRepository {
  private docClient;
  private tableName = 'RefreshTokens';

  constructor(
    @inject(TYPES.DynamoDBClient)
    private readonly client: DynamoDBClient,
  ) {
    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        convertClassInstanceToMap: true,
      },
    });
  }

  async add(jti: string, tokenExpiresIn: number): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        jti,
        expiresAt: tokenExpiresIn,
      },
    });

    await this.docClient.send(command);
  }

  async exists(jti: string): Promise<boolean> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        jti,
      },
    });
    const result = await this.docClient.send(command);
    return !!result.Item;
  }
}
