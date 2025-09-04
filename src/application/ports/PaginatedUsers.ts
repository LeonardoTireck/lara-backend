import { User } from "../../domain/User";

export interface PaginatedUsers {
  users: User[];
  lastEvaluatedKey?: Record<string, string>;
}
