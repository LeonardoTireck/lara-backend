import { User } from "../../domain/User";

export interface UserRepository {
  save(user: User): Promise<void>;
  update(user: User): Promise<User | undefined>;
  getById(userId: string): Promise<User | undefined>;
  getByEmail(userEmail: string): Promise<User | undefined>;
  getAll(): Promise<User[] | undefined>;
  delete(userId: string): Promise<User | undefined>;
}
