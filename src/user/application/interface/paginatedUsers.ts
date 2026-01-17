import { User } from '../../domain/user';

export interface PaginatedUsers {
  users: User[];
  lastEvaluatedKey?: { id: string };
}
