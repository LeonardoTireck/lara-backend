import { UserRepository } from "../domain/UserRepository";

export class FindAllUsers {
  constructor(private UserRepo: UserRepository) {}

  async execute(): Promise<Output | undefined> {
    const users = await this.UserRepo.findAll();
    if (!users) throw new Error("Users not found.");
    return users;
  }
}

type Output = {
  id: string;
  name: string;
  email: string;
}[];
