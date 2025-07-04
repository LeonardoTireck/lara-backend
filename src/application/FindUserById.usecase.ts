import { UserRepository } from "../domain/UserRepository";

export class FindUserById {
  constructor(private UserRepo: UserRepository) {}

  async execute(userId: string) {
    const user = this.UserRepo.findById(userId);

    if (user) {
      return user;
    } else {
      throw new Error("User not found.");
    }
  }
}
