import { User } from '../../../domain/aggregates/user';

export interface PaginatedUsers {
  users: User[];
  lastEvaluatedKey?: { id: string };
}
