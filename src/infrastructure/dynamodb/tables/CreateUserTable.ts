import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import "dotenv/config";
import { client } from "../DynamoDBClient";

async function createTable() {
  try {
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
  } catch (error) {
    console.log(error);
  }
}

createTable().catch(console.error);
