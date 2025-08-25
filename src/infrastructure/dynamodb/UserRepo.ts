import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { UserRepository } from "../../application/ports/UserRepository";
import { User } from "../../domain/User";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import "dotenv/config";

export class DynamoDbUserRepo implements UserRepository {
  private client;
  private docClient;

  constructor() {
    const accessKeyId = `${process.env.AWS_ACCESS_KEY_ID}`;
    const secretAccessKey = `${process.env.AWS_SECRET_ACCESS_KEY}`;
    const region = `${process.env.AWS_REGION}`;
    const endpoint = `${process.env.DDB_ENDPOINT}`;

    this.client = new DynamoDBClient({
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  async save(user: User): Promise<void> {
    const command = new PutCommand({
      TableName: "Users",
      Item: {
        Id: user.id,
        Name: user.name,
        Email: user.email,
        DocumentCPF: user.documentCPF,
        Phone: user.phone,
        HashedPassword: user.hashedPassword,
        DateOfBirth: user.dateOfBirth,
        DateOfFirstPlanIngress: user.dateOfFirstPlanIngress,
        ActivePlan: user.activePlan,
        PastPlans: user.pastPlans,
        Parq: user.parq,
        LastParqUpdate: user.lastParqUpdate,
        TrainingSessions: user.trainingSessions,
        UserType: user.userType,
      },
    });
    const response = await this.docClient.send(command);
    return;
  }
  update(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getById(userId: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  getByEmail(userEmail: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async getAll(): Promise<User[] | undefined> {
    const usersArray: User[] = [];
    const command = new ScanCommand({
      TableName: "Users",
    });

    const response = await this.client.send(command);
    if (!response.Items) throw new Error("No users found.");

    response.Items.forEach((element) => {
      console.log(element.Id, element.Name);
    });

    return;
  }
  delete(userId: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
}
