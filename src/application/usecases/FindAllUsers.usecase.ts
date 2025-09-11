import { inject, injectable } from 'inversify';
import { UserRepository } from '../ports/UserRepository';
import { TYPES } from '../../di/Types';
import { TrainingPlan } from '../../domain/ValueObjects/TrainingPlan';

@injectable()
export class FindAllUsers {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepo: UserRepository,
    ) {}

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

export interface FindAllUsersInput {
    limit: number;
    exclusiveStartKey?: Record<string, any>;
}

interface UserOutput {
    id: string;
    name: string;
    email: string;
    activePlan?: TrainingPlan;
}

export interface FindAllUsersOutput {
    users: UserOutput[];
    lastEvaluatedKey?: Record<string, any>;
}
