import { User } from "../../domain/User";
import { UserRepository } from "../../application/ports/UserRepository";

export class InMemoryUserRepo implements UserRepository {
  public users: User[] = [];

  async save(user: User) {
    this.users.push(user);
  }

  async update(user: User): Promise<void> {
    let userToBeUpdated = this.users.find((u) => u.id === user.id);
    if (!userToBeUpdated) throw new Error("User not found.");
    if (user.email) {
      userToBeUpdated.updateEmail(user.email);
    }
    if (user.hashedPassword) {
      userToBeUpdated.updatePassword(user.hashedPassword);
    }
    if (user.phone) {
      userToBeUpdated.updatePhone(user.phone);
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

  async delete(userId: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.id === userId);
    if (!user) throw new Error("User not found.");
    const userIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(userIndex, 1);
    return user;
  }

  async getAll(): Promise<User[] | undefined> {
    return this.users;
  }
}
