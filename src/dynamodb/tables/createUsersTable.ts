import { CreateTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { container } from '../../di/inversify.config';
import { TYPES } from '../../di/types';

async function createTable() {
  const client = container.get<DynamoDBClient>(TYPES.DynamoDBClient);
  try {
    const command = new CreateTableCommand({
      TableName: 'Users',
      AttributeDefinitions: [
        {
          AttributeName: 'id',
          AttributeType: 'S',
        },
        {
          AttributeName: 'email',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'id',
          KeyType: 'HASH',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'EmailIndex',
          KeySchema: [
            {
              AttributeName: 'email',
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
