import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { container } from '../../../di/Inversify.config';
import { TYPES } from '../../../di/Types';

async function createTable() {
  const client = container.get<DynamoDBClient>(TYPES.DynamoDBClient);
  try {
    const command = new CreateTableCommand({
      TableName: 'RefreshTokens',
      AttributeDefinitions: [
        {
          AttributeName: 'token',
          AttributeType: 'S',
        },
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'token',
          KeyType: 'HASH',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'UserIdIndex',
          KeySchema: [
            {
              AttributeName: 'userId',
              KeyType: 'HASH',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
        },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    });

    const response = await client.send(command);
    console.log('Table created successfully:', response);
    return response;
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

createTable().catch(console.error);
