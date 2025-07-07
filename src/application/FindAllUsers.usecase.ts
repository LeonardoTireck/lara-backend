import { UserRepository } from "../domain/UserRepository";

export class FindAllUsers {
  constructor(private UserRepo: UserRepository) {}

  async execute(): Promise<Output | undefined> {
    const users = await this.UserRepo.getAll();
    if (!users) throw new Error("Users not defined properly.");
    const output = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    });
    return output;
  }
}

type Output = {
  id: string;
  name: string;
  email: string;
}[];
