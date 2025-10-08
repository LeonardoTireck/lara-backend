import {
  DeleteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { container } from '../di/Inversify.config';
import { TYPES } from '../di/Types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export async function cleanupExpiredToken() {
  const client = container.get<DynamoDBClient>(TYPES.DynamoDBClient);
  const docClient = DynamoDBDocumentClient.from(client);
  const tableName = 'RefreshTokens';
  const now = Math.floor(Date.now() / 1000);

  console.log('Cleaning up expired refresh tokens...');

  try {
    const scanCommand = new ScanCommand({
      TableName: tableName,
      FilterExpression: 'expiresAt < :now',
      ExpressionAttributeValues: {
        ':now': now,
      },
      ProjectionExpression: 'jti',
    });
    const { Items } = await docClient.send(scanCommand);
    if (!Items || Items.length === 0) {
      console.log('No expired tokens to clean up.');
      return;
    }
    console.log(`Found ${Items.length} expired tokens to delete.`);
    for (const item of Items) {
      const deleteCommand = new DeleteCommand({
        TableName: tableName,
        Key: {
          jti: item.jti,
        },
      });
      await docClient.send(deleteCommand);
    }
    console.log('Cleanup complete.');
  } catch (error) {
    console.error('Error during token cleanup:', error);
  }
}

cleanupExpiredToken().catch(console.error);
