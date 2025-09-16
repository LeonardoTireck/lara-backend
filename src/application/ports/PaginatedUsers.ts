import { User } from '../../domain/Aggregates/User';

export interface PaginatedUsers {
  users: User[];
  lastEvaluatedKey?: { id: string };
}
