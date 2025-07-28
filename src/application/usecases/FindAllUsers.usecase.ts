import { UserRepository } from "../ports/UserRepository";

export class FindAllUsers {
  constructor(private userRepo: UserRepository) {}

  async execute(): Promise<Output | undefined> {
    const users = await this.userRepo.getAll();
    if (!users) throw new Error("No users found.");
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
