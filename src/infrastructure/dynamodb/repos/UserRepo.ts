import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import "dotenv/config";
import { UserRepository } from "../../../application/ports/UserRepository";
import { User } from "../../../domain/User";
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
              startDate: user.activePlan.startDate.toISOString(),
              expirationDate: user.activePlan.expirationDate.toISOString(),
            }
          : undefined,
        pastPlans: user.pastPlans
          ? user.pastPlans.map((plan) => ({
              planType: plan.planType,
              paymentMethod: plan.paymentMethod,
              startDate: plan.startDate.toISOString(),
              expirationDate: plan.expirationDate.toISOString(),
            }))
          : [],
        parq: user.parq,
        lastParqUpdate: user.lastParqUpdate?.toISOString(),
        trainingSessions: user.trainingSessions
          ? user.trainingSessions.map((session) => ({
              ...session,
              createdAt: session.createdAt.toISOString(),
              updatedAt: session.updatedAt.toISOString(),
            }))
          : [],
        userType: user.userType,
      },
    });

    await this.docClient.send(command);
  }

  async update(user: User): Promise<void> {
    const command = new UpdateCommand({
      TableName: "Users",
      Key: {
        id: user.id,
      },
      UpdateExpression:
        "set #name = :n, #email = :e, #documentCPF = :d, #phone = :p, #hashedPassword = :h, #dateOfBirth = :db, #dateOfFirstPlanIngress = :dfpi, #activePlan = :ap, #pastPlans = :pp, #parq = :pa, #lastParqUpdate = :lpu, #trainingSessions = :ts, #userType = :ut",
      ExpressionAttributeNames: {
        "#name": "name",
        "#email": "email",
        "#documentCPF": "documentCPF",
        "#phone": "phone",
        "#hashedPassword": "hashedPassword",
        "#dateOfBirth": "dateOfBirth",
        "#dateOfFirstPlanIngress": "dateOfFirstPlanIngress",
        "#activePlan": "activePlan",
        "#pastPlans": "pastPlans",
        "#parq": "parq",
        "#lastParqUpdate": "lastParqUpdate",
        "#trainingSessions": "trainingSessions",
        "#userType": "userType",
      },
      ExpressionAttributeValues: {
        ":n": user.name,
        ":e": user.email,
        ":d": user.documentCPF,
        ":p": user.phone,
        ":h": user.hashedPassword,
        ":db": user.dateOfBirth.toISOString(),
        ":dfpi": user.dateOfFirstPlanIngress.toISOString(),
        ":ap": user.activePlan
          ? {
              planType: user.activePlan.planType,
              paymentMethod: user.activePlan.paymentMethod,
              startDate: user.activePlan.startDate.toISOString(),
              expirationDate: user.activePlan.expirationDate.toISOString(),
            }
          : null,
        ":pp": user.pastPlans
          ? user.pastPlans.map((plan) => ({
              planType: plan.planType,
              paymentMethod: plan.paymentMethod,
              startDate: plan.startDate.toISOString(),
              expirationDate: plan.expirationDate.toISOString(),
            }))
          : [],
        ":pa": user.parq ?? null,
        ":lpu": user.lastParqUpdate?.toISOString() ?? null,
        ":ts": user.trainingSessions
          ? user.trainingSessions.map((session) => ({
              ...session,
              createdAt: session.createdAt.toISOString(),
              updatedAt: session.updatedAt.toISOString(),
            }))
          : [],
        ":ut": user.userType,
      },
    });
    await this.docClient.send(command);
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

    return User.fromRaw(response.Item);
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

  async delete(userId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: "Users",
      Key: {
        id: userId,
      },
      ConditionExpression: "attribute_exists(id)",
    });

    try {
      await this.docClient.send(command);
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        throw new Error(
          `User with ID '${userId}' not found and could not be deleted.`,
        );
      }
      throw error;
    }
  }
}
