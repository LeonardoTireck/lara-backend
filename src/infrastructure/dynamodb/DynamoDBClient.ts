import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';
import { ConfigService } from '../config/ConfigService';

export function createDynamoDBClient(config: ConfigService): DynamoDBClient {
  return new DynamoDBClient({
    region: config.awsRegion,
    endpoint: config.ddbEndpoint,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });
}
