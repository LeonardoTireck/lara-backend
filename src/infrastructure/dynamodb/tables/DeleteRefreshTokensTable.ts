import {
  DeleteTableCommand,
  waitUntilTableNotExists,
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { container } from '../../../di/inversify.config';
import { TYPES } from '../../../di/types';

async function dropUsersTable() {
  const client = container.get<DynamoDBClient>(TYPES.DynamoDBClient);
  try {
    console.log('Deleting Tokens table...');
    await client.send(new DeleteTableCommand({ TableName: 'RefreshTokens' }));

    await waitUntilTableNotExists(
      { client, maxWaitTime: 60 },
      { TableName: 'RefreshTokens' },
    );
    console.log('Tokens table deleted successfully!');
  } catch (error: any) {
    if (error.name === 'ResourceNotFoundException') {
      console.log('Tokens table does not exist.');
    } else {
      throw error;
    }
  }
}

dropUsersTable().catch(console.error);
