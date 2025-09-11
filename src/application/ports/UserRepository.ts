import { User } from '../../domain/Aggregates/User';
import { PaginatedUsers } from './PaginatedUsers';

export interface UserRepository {
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  getById(userId: string): Promise<User | undefined>;
  getByEmail(userEmail: string): Promise<User | undefined>;
  getAll(
    limit: number,
    exclusiveStartKey?: Record<string, any>,
  ): Promise<PaginatedUsers>;
  delete(userId: string): Promise<void>;
}
