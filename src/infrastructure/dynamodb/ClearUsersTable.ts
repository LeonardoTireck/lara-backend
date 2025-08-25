import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import "dotenv/config";

async function clearUsersTable() {
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.DDB_ENDPOINT, // optional for DynamoDB Local
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const docClient = DynamoDBDocumentClient.from(client);

  // Scan the table
  const scanResult = await docClient.send(
    new ScanCommand({ TableName: "Users" }),
  );

  if (!scanResult.Items || scanResult.Items.length === 0) {
    console.log("Users table is already empty.");
    return;
  }

  // Delete each item
  for (const item of scanResult.Items) {
    await docClient.send(
      new DeleteCommand({
        TableName: "Users",
        Key: {
          Id: item.Id, // assuming "Id" is the primary key
        },
      }),
    );
    console.log(`Deleted user with Id: ${item.Id}`);
  }

  console.log("All users deleted.");
}

clearUsersTable().catch(console.error);
