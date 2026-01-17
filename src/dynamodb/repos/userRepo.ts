import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import 'dotenv/config';
import { inject, injectable } from 'inversify';
import { NotFoundError } from '../../error/appError';
import { PaginatedUsers } from '../../user/application/interface/paginatedUsers';
import { UserRepository } from '../../user/application/interface/userRepository';
import { TYPES } from '../../di/types';
import { User } from '../../domain/aggregates/user';

@injectable()
export class DynamoDbUserRepo implements UserRepository {
  private docClient;

  constructor(
    @inject(TYPES.DynamoDBClient)
    private readonly client: DynamoDBClient,
  ) {
    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        convertClassInstanceToMap: true,
      },
    });
  }
  async save(user: User): Promise<void> {
    const command = new PutCommand({
      TableName: 'Users',
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
        lastParqUpdate: user.lastParqUpdate
          ? user.lastParqUpdate.toISOString()
          : undefined,
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
      TableName: 'Users',
      Key: {
        id: user.id,
      },
      ConditionExpression: 'attribute_exists(id)',
      UpdateExpression:
        'set #name = :n, #email = :e, #documentCPF = :d, #phone = :p, #hashedPassword = :h, #dateOfBirth = :db, #dateOfFirstPlanIngress = :dfpi, #activePlan = :ap, #pastPlans = :pp, #parq = :pa, #lastParqUpdate = :lpu, #trainingSessions = :ts, #userType = :ut',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email',
        '#documentCPF': 'documentCPF',
        '#phone': 'phone',
        '#hashedPassword': 'hashedPassword',
        '#dateOfBirth': 'dateOfBirth',
        '#dateOfFirstPlanIngress': 'dateOfFirstPlanIngress',
        '#activePlan': 'activePlan',
        '#pastPlans': 'pastPlans',
        '#parq': 'parq',
        '#lastParqUpdate': 'lastParqUpdate',
        '#trainingSessions': 'trainingSessions',
        '#userType': 'userType',
      },
      ExpressionAttributeValues: {
        ':n': user.name,
        ':e': user.email,
        ':d': user.documentCPF,
        ':p': user.phone,
        ':h': user.hashedPassword,
        ':db': user.dateOfBirth.toISOString(),
        ':dfpi': user.dateOfFirstPlanIngress.toISOString(),
        ':ap': user.activePlan
          ? {
              planType: user.activePlan.planType,
              paymentMethod: user.activePlan.paymentMethod,
              startDate: user.activePlan.startDate.toISOString(),
              expirationDate: user.activePlan.expirationDate.toISOString(),
            }
          : null,
        ':pp': user.pastPlans
          ? user.pastPlans.map((plan) => ({
              planType: plan.planType,
              paymentMethod: plan.paymentMethod,
              startDate: plan.startDate.toISOString(),
              expirationDate: plan.expirationDate.toISOString(),
            }))
          : [],
        ':pa': user.parq ?? null,
        ':lpu': user.lastParqUpdate ? user.lastParqUpdate.toISOString() : null,
        ':ts': user.trainingSessions
          ? user.trainingSessions.map((session) => ({
              ...session,
              createdAt: session.createdAt.toISOString(),
              updatedAt: session.updatedAt.toISOString(),
            }))
          : [],
        ':ut': user.userType,
      },
    });
    try {
      await this.docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new NotFoundError(user.id);
      }
      throw error;
    }
  }
  async getById(userId: string): Promise<User | undefined> {
    const command = new GetCommand({
      TableName: 'Users',
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
    const command = new QueryCommand({
      TableName: 'Users',
      IndexName: 'EmailIndex',
      KeyConditionExpression: '#email = :emailValue',
      ExpressionAttributeNames: {
        '#email': 'email',
      },
      ExpressionAttributeValues: {
        ':emailValue': userEmail,
      },
    });

    const response = await this.docClient.send(command);

    if (!response.Items || response.Items.length === 0) {
      return undefined;
    }
    return User.fromRaw(response.Items[0]);
  }

  async getAll(
    limit: number,
    exclusiveStartKey?: string,
  ): Promise<PaginatedUsers> {
    const command = new ScanCommand({
      TableName: 'Users',
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey
        ? { id: exclusiveStartKey }
        : undefined,
    });

    const response = await this.docClient.send(command);

    const users = response.Items ? response.Items.map(User.fromRaw) : [];

    const lastEvaluatedKeyOutput = response.LastEvaluatedKey
      ? { id: response.LastEvaluatedKey.id }
      : undefined;

    return {
      users: users,
      lastEvaluatedKey: lastEvaluatedKeyOutput,
    };
  }

  async delete(userId: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: 'Users',
      Key: {
        id: userId,
      },
      ConditionExpression: 'attribute_exists(id)',
    });

    try {
      await this.docClient.send(command);
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new NotFoundError(userId);
      }
      throw error;
    }
  }
}
