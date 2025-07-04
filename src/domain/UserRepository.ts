import { User } from "./User";

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(userId: string): Promise<User | undefined>;
  delete(userId: string): Promise<User | undefined>;
  findAll(): Promise<User[] | undefined>;
}
