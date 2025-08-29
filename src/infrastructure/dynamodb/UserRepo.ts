import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./DynamoDBClient";
import { UserRepository } from "../../application/ports/UserRepository";
import { User } from "../../domain/User";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import "dotenv/config";
import { UserType } from "../../domain/UserType";

export class DynamoDbUserRepo implements UserRepository {
  private docClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        convertClassInstanceToMap: true,
      },
    });
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
        DateOfBirth: user.dateOfBirth.toISOString(),
        DateOfFirstPlanIngress: user.dateOfFirstPlanIngress.toISOString(),
        ActivePlan: user.activePlan,
        PastPlans: user.pastPlans,
        Parq: user.parq,
        LastParqUpdate: user.lastParqUpdate?.toISOString(),
        TrainingSessions: user.trainingSessions,
        UserType: user.userType,
      },
    });
    await this.docClient.send(command);
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

    const response = await this.docClient.send(command);
    if (!response.Items) throw new Error("No users found.");

    response.Items.map((u: any) => {
      let newUser = new User(
        String(u.Id.S!),
        u.UserType.S! as UserType,
        String(u.Name.S!), // ensure it's a string
        new Date(u.DateOfFirstPlanIngress.S!),
        String(u.DocumentCPF.S!),
        new Date(u.DateOfBirth.S!),
        String(u.Email.S!),
        String(u.Phone.S!),
        String(u.HashedPassword.S!),
        u.ActivePlan.M! as any,
        u.PastPlans.L! as any,
        u.Parq as any,
        u.LastParqUpdate as any,
        u.TrainingSessions.L! as any,
      );
      usersArray.push(newUser);
    });
    return usersArray;
  }

  delete(userId: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
}
