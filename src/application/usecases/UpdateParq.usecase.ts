import { Parq } from "../../domain/Parq";
import { UserRepository } from "../ports/UserRepository";

export class UpdateParq {
  constructor(private userRepo: UserRepository) {}

  async execute(input: Input) {
    const user = await this.userRepo.getById(input.userId);
    if (!user) throw new Error("User not found.");

    user.updateParq(input.newParq);
    this.userRepo.update(user);
    return user;
  }
}

type Input = {
  userId: string;
  newParq: Parq;
};
