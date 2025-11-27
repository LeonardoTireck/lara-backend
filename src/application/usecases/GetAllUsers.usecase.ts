import { inject, injectable } from 'inversify';
import { UserRepository } from '../ports/UserRepository';
import { TYPES } from '../../di/Types';
import { TrainingPlan } from '../../domain/ValueObjects/TrainingPlan';

@injectable()
export class GetAllUsers {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(input: GetAllUsersInput): Promise<GetAllUsersOutput> {
    const paginatedResult = await this.userRepo.getAll(
      input.limit,
      input.exclusiveStartKey,
    );

    const outputUsers = paginatedResult.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        activePlan: user.activePlan,
      };
    });

    return {
      users: outputUsers,
      lastEvaluatedKey: paginatedResult.lastEvaluatedKey,
    };
  }
}

export interface GetAllUsersInput {
  limit: number;
  exclusiveStartKey?: string;
}

interface UserOutput {
  id: string;
  name: string;
  email: string;
  activePlan?: TrainingPlan;
}

export interface GetAllUsersOutput {
  users: UserOutput[];
  lastEvaluatedKey?: { id: string };
}
