import { UserRepository } from "../domain/UserRepository";

export class FindUserById {
  constructor(private UserRepo: UserRepository) {}

  async execute(input: Input): Promise<Output | undefined> {
    const user = this.UserRepo.findById(input.userId);

    if (user) {
      return user;
    } else {
      throw new Error("User not found.");
    }
  }
}

type Input = {
  userId: string;
};

type Output = {
  id: string;
  name: string;
  email: string;
  password: string;
};
