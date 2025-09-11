import {
  ConflictError,
  NotFoundError,
} from '../../application/errors/AppError';
import { UserRepository } from '../../application/ports/UserRepository';
import { User } from '../../domain/Aggregates/User';

export class InMemoryUserRepo implements UserRepository {
  public users: User[] = [];

  async save(user: User) {
    const existingUser = this.users.find((u) => u.email === user.email);
    if (existingUser) {
      throw new ConflictError('User with this email already exists.');
    }
    this.users.push(user);
  }

  async update(user: User): Promise<void> {
    const userToBeUpdated = this.users.find((u) => u.id === user.id);
    if (!userToBeUpdated) throw new NotFoundError('User');
    if (user.email) {
      userToBeUpdated.updateEmail(user.email);
    }
    if (user.hashedPassword) {
      userToBeUpdated.updatePassword(user.hashedPassword);
    }
    if (user.phone) {
      userToBeUpdated.updatePhone(user.phone);
    }
    if (user.trainingSessions) {
      userToBeUpdated.updateTrainingSessions(user.trainingSessions);
    }
    if (user.activePlan) {
      userToBeUpdated.updateActivePlan(user.activePlan);
    }
    if (user.parq) {
      userToBeUpdated.updateParq(user.parq);
    }
  }

  async getById(userId: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === userId);
    return user;
  }

  async getByEmail(userEmail: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.email === userEmail);
    return user;
  }

  async delete(userId: string): Promise<void> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) throw new NotFoundError('User');
    const userIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(userIndex, 1);
    return;
  }

  async getAll(limit: number, exclusiveStartKey?: Record<string, any>) {
    if (limit <= 0) {
      return {
        users: [],
        lastEvaluatedKey: undefined,
      };
    }
    const startIndex = exclusiveStartKey ? exclusiveStartKey.index : 0;
    const endIndex = startIndex + limit;
    const usersSlice = this.users.slice(startIndex, endIndex);
    let lastEvaluatedKey;
    if (endIndex < this.users.length) {
      lastEvaluatedKey = { index: endIndex };
    }
    return {
      users: usersSlice,
      lastEvaluatedKey: lastEvaluatedKey,
    };
  }
}