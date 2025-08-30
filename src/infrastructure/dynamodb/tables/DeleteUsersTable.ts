import {
  DeleteTableCommand,
  waitUntilTableNotExists,
} from "@aws-sdk/client-dynamodb";
import "dotenv/config";
import { client } from "../DynamoDBClient";

async function dropUsersTable() {
  try {
    console.log("Deleting Users table...");
    await client.send(new DeleteTableCommand({ TableName: "Users" }));

    await waitUntilTableNotExists(
      { client, maxWaitTime: 60 },
      { TableName: "Users" },
    );
    console.log("Users table deleted successfully!");
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.log("Users table does not exist.");
    } else {
      throw error;
    }
  }
}

dropUsersTable().catch(console.error);
