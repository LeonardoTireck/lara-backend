import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://localhost:8000",
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
