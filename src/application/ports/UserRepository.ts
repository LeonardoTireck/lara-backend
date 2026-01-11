import { User } from '../../domain/aggregates/user';
import { PaginatedUsers } from './paginatedUsers';

export interface UserRepository {
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  getById(userId: string): Promise<User | undefined>;
  getByEmail(userEmail: string): Promise<User | undefined>;
  getAll(limit: number, exclusiveStartKey?: string): Promise<PaginatedUsers>;
  delete(userId: string): Promise<void>;
}
