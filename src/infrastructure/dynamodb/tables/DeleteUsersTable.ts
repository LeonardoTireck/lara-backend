import {
    DeleteTableCommand,
    waitUntilTableNotExists,
    DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { container } from '../../../di/Inversify.config';
import { TYPES } from '../../../di/Types';

async function dropUsersTable() {
    const client = container.get<DynamoDBClient>(TYPES.DynamoDBClient);
    try {
        console.log('Deleting Users table...');
        await client.send(new DeleteTableCommand({ TableName: 'Users' }));

        await waitUntilTableNotExists(
            { client, maxWaitTime: 60 },
            { TableName: 'Users' },
        );
        console.log('Users table deleted successfully!');
    } catch (error: any) {
        if (error.name === 'ResourceNotFoundException') {
            console.log('Users table does not exist.');
        } else {
            throw error;
        }
    }
}

dropUsersTable().catch(console.error);
