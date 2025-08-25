import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import "dotenv/config";

const accessKeyId = `${process.env.AWS_ACCESS_KEY_ID}`;
const secretAccessKey = `${process.env.AWS_SECRET_ACCESS_KEY}`;

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://host.docker.internal:8000",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});

export const main = async () => {
  const command = new CreateTableCommand({
    TableName: "Users",
    AttributeDefinitions: [
      {
        AttributeName: "Id",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "Id",
        KeyType: "HASH",
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  const response = await client.send(command);
  console.log(response);
  return response;
};

main();
