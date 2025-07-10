import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export class InMemoryUserRepo implements UserRepository {
  public users: User[] = [];

  async save(user: User) {
    this.users.push(user);
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
    const output = this.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        hashedPassword: user.hashedPassword,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        userType: user.userType,
        planType: user.planType,
        dateOfRegistration: user.dateOfRegistration,
        expirationDate: user.expirationDate,
        paymentMethod: user.paymentMethod,
        lastParqUpdate: user.lastParqUpdate,
        trainingSessions: user.trainingSessions,
        parq: user.parq,
      };
    });
    return output;
  }
}
