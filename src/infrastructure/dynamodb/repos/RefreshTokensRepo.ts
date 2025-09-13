import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import 'dotenv/config';
import { inject, injectable } from 'inversify';
import { NotFoundError } from '../../../application/errors/AppError';
import { RefreshTokenRepository } from '../../../application/ports/RefreshTokenRepository';
import { TYPES } from '../../../di/Types';

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
  async save(token: string, userId: string): Promise<void> {
    try {
      await this.delete(userId);
    } catch (error) {
      if (!(error instanceof NotFoundError)) {
        throw error;
      }
    }

    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        userId,
        token,
      },
    });

    await this.docClient.send(command);
  }

  async getById(userId: string): Promise<string> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ProjectionExpression: '#token',
      ExpressionAttributeNames: {
        '#token': 'token',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const response = await this.docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      throw new NotFoundError('Token');
    }

    return response.Items[0].token;
  }

  async delete(userId: string): Promise<void> {
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ProjectionExpression: '#token',
      ExpressionAttributeNames: {
        '#token': 'token',
      },
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    });

    const { Items } = await this.docClient.send(queryCommand);

    if (!Items || Items.length === 0) {
      throw new NotFoundError(`Token`);
    }

    for (const item of Items) {
      const deleteCommand = new DeleteCommand({
        TableName: this.tableName,
        Key: {
          token: item.token,
        },
      });
      await this.docClient.send(deleteCommand);
    }
  }
}
