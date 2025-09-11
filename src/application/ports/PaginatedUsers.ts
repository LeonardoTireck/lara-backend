import { User } from '../../domain/Aggregates/User';

export interface PaginatedUsers {
    users: User[];
    lastEvaluatedKey?: Record<string, string>;
}
