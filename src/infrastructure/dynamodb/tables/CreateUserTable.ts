import { CreateTableCommand } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';
import { client } from '../DynamoDBClient';

async function createTable() {
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
