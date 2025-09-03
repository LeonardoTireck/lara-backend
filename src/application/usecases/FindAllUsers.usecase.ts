import { TrainingPlan } from "../../domain/TrainingPlan";
import { UserRepository } from "../ports/UserRepository";

export class FindAllUsers {
  constructor(private userRepo: UserRepository) {}

  // Updated signature to use the exported types
  async execute(input: FindAllUsersInput): Promise<FindAllUsersOutput> {
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

export type FindAllUsersInput = {
  limit: number;
  exclusiveStartKey?: Record<string, any>;
};

type UserOutput = {
  id: string;
  name: string;
  email: string;
  activePlan?: TrainingPlan;
};

export type FindAllUsersOutput = {
  users: UserOutput[];
  lastEvaluatedKey?: Record<string, any>;
};

