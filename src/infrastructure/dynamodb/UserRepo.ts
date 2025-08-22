import { UserRepository } from "../../application/ports/UserRepository";
import { User } from "../../domain/User";

export class DynamoDbUserRepo implements UserRepository {
  save(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getById(userId: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  getByEmail(userEmail: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  getAll(): Promise<User[] | undefined> {
    throw new Error("Method not implemented.");
  }
  delete(userId: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
}
