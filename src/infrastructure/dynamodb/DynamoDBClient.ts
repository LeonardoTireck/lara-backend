import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import "dotenv/config";

export const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  endpoint: process.env.DDB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
