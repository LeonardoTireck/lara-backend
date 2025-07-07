import { User } from "../../domain/User";
import { UserRepository } from "../../domain/UserRepository";

export class InMemoryUserRepo implements UserRepository {
  public users: User[] = [
    {
      id: "99",
      name: "John Doe",
      email: "john@doe.com",
      password: "securePassword",
    },
  ];

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
    const userIndex = this.users.findIndex((user) => user.id === userId);
    this.users.splice(userIndex, 1);
    if (user) return user;
  }

  async getAll(): Promise<User[] | undefined> {
    const output = this.users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      };
    });
    return output;
  }
}
