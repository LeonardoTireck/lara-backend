import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import "dotenv/config";
import { UserRepository } from "../../../application/ports/UserRepository";
import { User } from "../../../domain/User";
import { UserType } from "../../../domain/UserType";
import { client } from "../DynamoDBClient";
import { TrainingSession } from "../../../domain/TrainingSession";
import { TrainingPlan } from "../../../domain/TrainingPlan";

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
        id: user.id,
        name: user.name,
        email: user.email,
        documentCPF: user.documentCPF,
        phone: user.phone,
        hashedPassword: user.hashedPassword,
        dateOfBirth: user.dateOfBirth.toISOString(),
        dateOfFirstPlanIngress: user.dateOfFirstPlanIngress.toISOString(),
        activePlan: user.activePlan
          ? {
              planType: user.activePlan.planType,
              paymentMethod: user.activePlan.paymentMethod,
              startDate: user.activePlan.startDate,
              expirationDate: user.activePlan.expirationDate,
            }
          : undefined,
        pastPlans: user.pastPlans
          ? user.pastPlans.map((plan) => ({
              planType: plan.planType,
              paymentMethod: plan.paymentMethod,
              startDate: plan.startDate,
              expirationDate: plan.expirationDate,
            }))
          : [],
        parq: user.parq,
        lastParqUpdate: user.lastParqUpdate?.toISOString(),
        trainingSessions: user.trainingSessions
          ? user.trainingSessions.map((session) => ({
              ...session,
              createdAt: session.createdAt,
              updatedAt: session.updatedAt,
            }))
          : [],
        userType: user.userType,
      },
    });
    await this.docClient.send(command);
  }

  async update(user: User): Promise<void> {
    throw new Error("Method not implemented");
  }
  async getById(userId: string): Promise<User | undefined> {
    const command = new GetCommand({
      TableName: "Users",
      Key: {
        id: userId,
      },
    });

    const response = await this.docClient.send(command);

    if (!response.Item) {
      return undefined;
    }

    const u = response.Item;
    const user = new User(
      String(u.id),
      u.userType as UserType,
      String(u.name),
      new Date(u.dateOfFirstPlanIngress),
      String(u.documentCPF),
      new Date(u.dateOfBirth),
      String(u.email),
      String(u.phone),
      String(u.hashedPassword),
      TrainingPlan.fromRaw(u.activePlan),
      u.pastPlans ? u.pastPlans.map(TrainingPlan.fromRaw) : [],
      u.parq as any,
      u.lastParqUpdate ? new Date(u.lastParqUpdate) : undefined,
      u.trainingSessions ? u.trainingSessions.map(TrainingSession.fromRaw) : [],
    );

    return user;
  }
  async getByEmail(userEmail: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }

  async getAll(): Promise<User[] | undefined> {
    const usersArray: User[] = [];
    const command = new ScanCommand({
      TableName: "Users",
    });

    const response = await this.docClient.send(command);
    if (!response.Items) throw new Error("No users found.");

    response.Items.map((u) => {
      usersArray.push(
        new User(
          u.id,
          u.userType,
          u.name,
          new Date(u.dateOfFirstPlanIngress),
          u.documentCPF,
          new Date(u.dateOfBirth),
          u.email,
          u.phone,
          u.hashedPassword,
          TrainingPlan.fromRaw(u.activePlan),
          u.pastPlans ? u.pastPlans.map(TrainingPlan.fromRaw) : [],
          u.parq,
          u.lastParqUpdate ? new Date(u.lastParqUpdate) : undefined,
          u.trainingSessions
            ? u.trainingSessions.map(TrainingSession.fromRaw)
            : [],
        ),
      );
    });

    return usersArray;
  }

  async delete(userId: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
}
